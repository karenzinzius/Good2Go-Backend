import { User } from "#models";
// GET /users
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};
// POST /users
const createUser = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
};
// GET /users/:id
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
        throw new Error("User not found!", { cause: 404 });
    res.json(user);
};
// PUT /users/:id
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser)
        throw new Error("User not found!", { cause: 404 });
    res.json(updatedUser);
};
// DELETE /users/:id
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const foundUser = await User.findByIdAndDelete(id);
    if (!foundUser)
        throw new Error("User not found!", { cause: 404 });
    res.json({ message: "User deleted!" });
};
export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
