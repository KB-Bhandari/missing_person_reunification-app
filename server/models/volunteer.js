import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"]
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer-not-to-say"],
    required: [true, "Gender is required"]
  },

  // Address Information
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, "PIN code is required"],
    match: [/^\d{6}$/, "Please provide a valid 6-digit PIN code"]
  },

  // Identity Verification
  idType: {
    type: String,
    enum: ["aadhar", "pan", "passport", "driving", "voter"],
    required: [true, "ID type is required"]
  },
  idNumber: {
    type: String,
    required: [true, "ID number is required"],
    trim: true,
    unique: true // Ensures no duplicate ID numbers
  },

  // Volunteer Details
  occupation: {
    type: String,
    required: [true, "Occupation is required"],
    trim: true
  },
  skills: {
    type: [String],
    // required: [true, "At least one skill is required"],
    validate: {
      validator: function(skills) {
        return skills && skills.length > 0;
      },
      message: "Please select at least one skill"
    }
  },
  experience: {
    type: String,
    default: ""
  },
  availability: {
    type: String,
    enum: ["weekends", "weekdays", "flexible", "full-time"],
    // required: [true, "Availability is required"],
    default: "weekends"
  },

  // Emergency Contact
  emergencyContact: {
    type: String,
    // required: [true, "Emergency contact name is required"],
    trim: true
  },
  emergencyPhone: {
    type: String,
    // required: [true, "Emergency phone number is required"],
    trim: true
  },

  // Additional Information
  reasonToVolunteer: {
    type: String,
    default: ""
  },
  assignedCamp: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Camp",
  default: null
}
,
  termsAccepted: {
    type: Boolean,
    required: [true, "You must accept terms and conditions"],
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: "Terms and conditions must be accepted"
    }
  },

  // Assignment and Status
  role: {
    type: String,
    default: "volunteer"
  },
  assignedCamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camp",
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected", "inactive"],
    default: "pending" // Changed default to pending for admin approval
  },

  // Approval Details
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },

  // Activity Tracking
  lastLogin: {
    type: Date
  },
  totalHoursContributed: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Indexes for better query performance
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ idNumber: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ assignedCamp: 1 });

// Pre-save middleware to update the updatedAt field
volunteerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to get full address
volunteerSchema.methods.getFullAddress = function() {
  return `${this.address}, ${this.city}, ${this.state} - ${this.pincode}`;
};

// Instance method to check if volunteer is approved
volunteerSchema.methods.isApproved = function() {
  return this.status === "active";
};

// Instance method to get age from date of birth
volunteerSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Static method to find pending volunteers
volunteerSchema.statics.findPending = function() {
  return this.find({ status: "pending" }).sort({ createdAt: -1 });
};

// Static method to find active volunteers
volunteerSchema.statics.findActive = function() {
  return this.find({ status: "active" }).sort({ name: 1 });
};

// Virtual for volunteer's full location
volunteerSchema.virtual('location').get(function() {
  return `${this.city}, ${this.state}`;
});

// Ensure virtuals are included when converting to JSON
volunteerSchema.set('toJSON', { virtuals: true });
volunteerSchema.set('toObject', { virtuals: true });

// Prevent OverwriteModelError
export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", volunteerSchema);