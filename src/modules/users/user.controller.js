import { User } from "./user.model.js";

// GET /users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /users  (superadmin creates user/admin)
export const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({
      name,
      email,
      password, // your pre-save hook hashes this
      role,
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /users/:id
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Do not allow role change to superadmin, and do not allow messing with _id
    delete updates._id;
    if (updates.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot set role to superadmin via this endpoint" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password present, pre-save hook will hash it
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.password !== undefined) user.password = updates.password;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot delete a superadmin user" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
