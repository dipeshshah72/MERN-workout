import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

interface IUser extends mongoose.Document {
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  signup(email: string, password: string): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
}

// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//signup static method
userSchema.statics.signup = async function (
  email: string,
  password: string
): Promise<IUser> {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });
  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password); //returns true of false

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
