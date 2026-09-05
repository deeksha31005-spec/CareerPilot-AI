import User from '../models/User.js';

/**
 * @desc    Get current user's profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);

    res.status(500).json({
      message: 'Failed to fetch profile'
    });
  }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, targetRole } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (targetRole !== undefined) {
      user.targetRole = targetRole.trim();
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      targetRole: updatedUser.targetRole,
      resume: updatedUser.resume
    });
  } catch (error) {
    console.error('Update Profile Error:', error);

    res.status(500).json({
      message: 'Failed to update profile'
    });
  }
};