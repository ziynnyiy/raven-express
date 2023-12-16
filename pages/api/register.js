import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handle(req, res) {
  await mongooseConnect();
  const { userEmail, password } = req.body;

  const oldUser = await User.findOne({ userEmail: userEmail });
  if (oldUser) {
    return res.json({ message: "電子信箱已經被註冊過" });
  }
  const user = await User.create({ userEmail, password });

  return res.json({
    user: {
      id: user._id.toString(),
      email: user.userEmail,
    },
  });
}
