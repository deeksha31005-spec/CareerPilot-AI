import User from '../models/User.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please select a resume file.'
      });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: 'Only PDF, DOC, and DOCX files are allowed.'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    user.resume = {
      fileName: req.file.originalname,
      fileUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      uploadedAt: new Date()
    };

    await user.save({
      validateBeforeSave: false
    });

    res.json({
      message: 'Resume uploaded successfully.',
      resume: user.resume
    });

  } catch (error) {
    console.error('Upload Resume Error:', error);

    res.status(500).json({
      message: 'Failed to upload resume.'
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    user.resume = {
      fileName: '',
      fileUrl: '',
      uploadedAt: null
    };

    await user.save({
      validateBeforeSave: false
    });

    res.json({
      message: 'Resume deleted successfully.'
    });

  } catch (error) {
    console.error('Delete Resume Error:', error);

    res.status(500).json({
      message: 'Failed to delete resume.'
    });
  }
};