import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },

    targetRole: {
      type: String,
      default: 'Software Engineer',
      trim: true
    },

    resume: {
      fileName: {
        type: String,
        default: ''
      },

      fileUrl: {
        type: String,
        default: ''
      },

      uploadedAt: {
        type: Date,
        default: null
      }
    },

    // Latest AI resume analysis
    resumeAnalysis: {
      atsScore: {
        type: Number,
        default: 0
      },

      summary: {
        type: String,
        default: ''
      },

      strengths: {
        type: [String],
        default: []
      },

      missingSkills: {
        type: [String],
        default: []
      },

      missingKeywords: {
        type: [String],
        default: []
      },

      improvements: {
        type: [String],
        default: []
      },

      sectionAnalysis: {
        contact: {
          type: String,
          default: ''
        },

        summary: {
          type: String,
          default: ''
        },

        skills: {
          type: String,
          default: ''
        },

        education: {
          type: String,
          default: ''
        },

        experience: {
          type: String,
          default: ''
        },

        projects: {
          type: String,
          default: ''
        },

        certifications: {
          type: String,
          default: ''
        }
      },

      analyzedAt: {
        type: Date,
        default: null
      }
    },

    // Interview history
    interviewHistory: {
      type: [
        {
          interviewType: {
            type: String,
            default: 'Technical'
          },

          difficulty: {
            type: String,
            default: 'Medium'
          },

          question: {
            type: String,
            default: ''
          },

          answer: {
            type: String,
            default: ''
          },

          score: {
            type: Number,
            default: 0
          },

          feedback: {
            type: String,
            default: ''
          },

          strengths: {
            type: [String],
            default: []
          },

          improvements: {
            type: [String],
            default: []
          },

          completedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: []
    },

    // Career roadmap history
    roadmapHistory: {
      type: [
        {
          targetRole: {
            type: String,
            default: 'Software Engineer'
          },

          currentLevel: {
            type: String,
            default: ''
          },

          careerSummary: {
            type: String,
            default: ''
          },

          skillGap: {
            type: [String],
            default: []
          },

          roadmap: {
            type: mongoose.Schema.Types.Mixed,
            default: []
          },

          recommendedProjects: {
            type: [String],
            default: []
          },

          recommendedCertifications: {
            type: [String],
            default: []
          },

          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});


userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};


const User = mongoose.model(
  'User',
  userSchema
);

export default User;