import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { hashSync } from 'bcryptjs';
import bcrypt from 'bcryptjs';
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,

      validate: {
        validator: function (value: string) {
          return /^[A-Za-z][A-Za-z0-9\s]*$/.test(value);
        },
        message:
          'Name must start with letter and  contain only letters and number and space.',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['landlord', 'admin', 'tenant'],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
// name validation

// userSchema.pre('validate', function (next) {
//   if (typeof this.name !== 'string') {
//     this.invalidate('name', 'Name must be a string.');
//   }
//   next();
// });

//hash password

userSchema.pre('save', async function (next) {
  const hashedPassword = hashSync(this.password, 10);
  this.password = hashedPassword;

  next();
});
// password filed  empty
userSchema.post('save', function () {
  this.password = '';
});
// user exists by email
userSchema.statics.isUserExists = async function (email: string) {
  const isUser = await User.findOne({ email: email });
  return isUser;
};
// user exists by id
userSchema.statics.doesUserExists = async function (id: string) {
  const doesUser = await User.findById(id);
  return doesUser;
};
// password does not match
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  const isPasswordMatch = bcrypt.compare(plainTextPassword, hashedPassword);
  return isPasswordMatch;
};
// 3. Create a Model.
export const User = model<TUser, UserModel>('User', userSchema);
