import { userRepository } from "../repositories/userRepository";
import { userAuthProviderRepository } from "../repositories/userAuthProviderRepository";
import { NotFoundError, BadRequestError } from "../errors/AppError";
import bcrypt from "bcrypt";

export const userService = {
  // Ver próprio perfil
  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Get email from auth provider
    const authProviders = await userAuthProviderRepository.findByUserId(userId);
    const localAuth = authProviders.find(p => p.provider === 'local');
    return { ...user, email: localAuth?.email || '' };
  },

  // Atualizar perfil
  updateProfile: async (
    userId: string,
    data: { name?: string; profile_picture?: string; email?: string; currentPassword?: string; newPassword?: string },
  ) => {
    // Update user table (name, profile_picture)
    const updatedUser = await userRepository.update(userId, {
      name: data.name,
      profile_picture: data.profile_picture,
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    // Update auth provider (email, password)
    if (data.email || data.newPassword) {
      const authProviders = await userAuthProviderRepository.findByUserId(userId);
      const localAuth = authProviders.find(p => p.provider === 'local');
      if (localAuth) {
        const authUpdate: Record<string, string> = {};
        if (data.email && data.email !== localAuth.email) {
          // Check if email already exists
          const exists = await userAuthProviderRepository.emailExists(data.email, 'local');
          if (exists) {
            throw new BadRequestError("Este email já está em uso");
          }
          authUpdate.email = data.email;
        }
        if (data.newPassword) {
          // As per the requirement, we skip current password verification 
          // to simplify the flow and treat login token as main validation
          authUpdate.password = await bcrypt.hash(data.newPassword, 10);
        }
        if (Object.keys(authUpdate).length > 0) {
          await userAuthProviderRepository.update(localAuth.id, authUpdate);
        }
      }
    }

    // Return updated profile with email
    const authProviders = await userAuthProviderRepository.findByUserId(userId);
    const localAuth = authProviders.find(p => p.provider === 'local');
    return { ...updatedUser, email: localAuth?.email || '' };
  },
  getAllUsers: async () => {
    return await userRepository.findAll();
  },
};
