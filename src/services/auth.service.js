const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

// FIRST REGISTER ON DB -> ADMIN
// TODO: Register COMPANY
const registerAdmin = async (data) => {
  return prisma.$transaction(async (tx) => {
    const userCount = await tx.user.count();

    if (userCount > 0) {
      throw { status: 403, message: "Admin already exists" };
    }

    const adminRole =
      (await tx.role.findUnique({ where: { name: "ADMIN" } })) ||
      (await tx.role.create({
        data: { name: "ADMIN" },
      }));

    // SALT_ROUNDS
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await tx.user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        username: data.username,
      },
    });

    await tx.userRole.create({
      data: {
        id_user: user.id_user,
        id_role: adminRole.id_role,
      },
    });

    return { username: user.username, email: user.email };
  });
};

// LOGIN
const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    throw {
      status: 400,
      message: "This email is not registered",
    };
  }

  const isValid = await bcrypt.compare(data.password, user.password_hash);

  if (!isValid) {
    throw {
      status: 400,
      message: "Incorrect Password",
    };
  }

  const roles = user.roles.map((ur) => ur.role.name);

  return {
    id_user: user.id_user,
    username: user.username,
    email: user.email,
    roles: roles,
  };
};

// CREATE USER -> ONLY ADMIN CAN CREATE USERS AND ASSIGN NEW ROLES
const createUser = async ({ email, password, role, username }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw {
      status: 400,
      message: "This email is already registered",
    };
  }

  let existingRole = await prisma.role.findUnique({
    where: { name: role },
  });

  if (!existingRole) {
    existingRole = await prisma.role.create({
      data: { name: role },
    });
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, username, password_hash: hashedPassword },
  });

  await prisma.userRole.create({
    data: { id_user: user.id_user, id_role: existingRole.id_role },
  });

  return user;
};

module.exports = {
  registerAdmin,
  login,
  createUser,
};
