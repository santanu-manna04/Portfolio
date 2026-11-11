const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const { UPLOAD_ROOT } = require('../config/paths');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const fileSignatures = {
  '.jpg': (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  '.png': (buffer) => buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  '.webp': (buffer) => buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
  '.pdf': (buffer) => buffer.length >= 5 && buffer.toString('ascii', 0, 5) === '%PDF-',
};

const removeStored = async (storedPath) => {
  if (!storedPath) return;
  const filename = path.basename(storedPath);
  const target = path.resolve(UPLOAD_ROOT, storedPath.replace(/^uploads[\\/]/, ''));
  const root = path.resolve(UPLOAD_ROOT) + path.sep;
  if (!target.startsWith(root) || filename !== path.basename(target)) {
    throw new Error('Stored upload path is outside the upload directory.');
  }
  try {
    await fs.promises.unlink(target);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
};

const filePath = (file, folder) => `uploads/${folder}/${file.filename}`;

const verifyFile = async (file, allowedExtensions, folder) => {
  if (!file) throw new ApiError(400, 'Choose a file to upload.');
  const extension = path.extname(file.filename).toLowerCase();
  const signature = fileSignatures[extension];
  try {
    if (!allowedExtensions.includes(extension) || !signature) {
      throw new ApiError(400, 'This file type is not allowed.');
    }
    const handle = await fs.promises.open(file.path, 'r');
    let valid;
    try {
      const buffer = Buffer.alloc(12);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      valid = signature(buffer.subarray(0, bytesRead));
    } finally {
      await handle.close();
    }
    if (!valid) throw new ApiError(400, 'The file contents do not match its file type.');
  } catch (err) {
    await removeStored(filePath(file, folder));
    throw err;
  }
};

const removeNewFiles = async (files, folder) => {
  for (const file of files) await removeStored(filePath(file, folder));
};

const findProject = async (id) => {
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

const findCertificate = async (id) => {
  const certificate = await Certificate.findById(id);
  if (!certificate) throw new ApiError(404, 'Certificate not found');
  return certificate;
};

exports.uploadThumbnail = asyncHandler(async (req, res) => {
  const file = req.file;
  await verifyFile(file, ['.jpg', '.png', '.webp'], 'projects');
  let project;
  let previous;
  try {
    project = await findProject(req.params.id);
    previous = project.thumbnail;
    project.thumbnail = filePath(file, 'projects');
    await project.save();
  } catch (err) {
    await removeStored(filePath(file, 'projects'));
    throw err;
  }
  await removeStored(previous);
  res.status(201).json({ success: true, data: project });
});

exports.uploadScreenshots = asyncHandler(async (req, res) => {
  const files = req.files || [];
  try {
    if (!files.length) throw new ApiError(400, 'Choose at least one image to upload.');
    for (const file of files) await verifyFile(file, ['.jpg', '.png', '.webp'], 'projects');
    const project = await findProject(req.params.id);
    if (project.screenshots.length + files.length > 10) {
      throw new ApiError(400, 'A project can have at most 10 screenshots.');
    }
    project.screenshots.push(...files.map((file) => filePath(file, 'projects')));
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    await removeNewFiles(files, 'projects');
    throw err;
  }
});

exports.removeThumbnail = asyncHandler(async (req, res) => {
  const project = await findProject(req.params.id);
  const previous = project.thumbnail;
  project.thumbnail = '';
  await project.save();
  await removeStored(previous);
  res.json({ success: true, data: project });
});

exports.removeScreenshot = asyncHandler(async (req, res) => {
  const project = await findProject(req.params.id);
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0 || index >= project.screenshots.length) {
    throw new ApiError(404, 'Project screenshot not found');
  }
  const [previous] = project.screenshots.splice(index, 1);
  await project.save();
  await removeStored(previous);
  res.json({ success: true, data: project });
});

exports.uploadCertificateFile = asyncHandler(async (req, res) => {
  const file = req.file;
  await verifyFile(file, ['.jpg', '.png', '.webp', '.pdf'], 'certificates');
  let certificate;
  let previous;
  try {
    certificate = await findCertificate(req.params.id);
    previous = certificate.file;
    certificate.file = filePath(file, 'certificates');
    certificate.fileType = path.extname(file.filename).toLowerCase() === '.pdf' ? 'pdf' : 'image';
    await certificate.save();
  } catch (err) {
    await removeStored(filePath(file, 'certificates'));
    throw err;
  }
  await removeStored(previous);
  res.status(201).json({ success: true, data: certificate });
});

exports.removeCertificateFile = asyncHandler(async (req, res) => {
  const certificate = await findCertificate(req.params.id);
  const previous = certificate.file;
  certificate.file = '';
  certificate.fileType = '';
  await certificate.save();
  await removeStored(previous);
  res.json({ success: true, data: certificate });
});

exports.removeStored = removeStored;
