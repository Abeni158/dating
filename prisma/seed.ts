import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(email: string, firstName: string, displayName: string, country: string, city: string, profileData: Partial<Record<string, string[] | string | number | null>>) {
  return prisma.user.create({
    data: {
      email,
      passwordHash: "seeded-password-hash",
      firstName,
      displayName,
      country,
      city,
      profileVisible: true,
      openToInternational: true,
      profiles: {
        create: {
          age: profileData.age as number | null,
          occupation: profileData.occupation as string | null,
          relationshipGoal: profileData.relationshipGoal as string | null,
          languages: profileData.languages as string[] | undefined,
          interests: profileData.interests as string[] | undefined,
          hobbies: profileData.hobbies as string[] | undefined,
          travelInterests: profileData.travelInterests as string[] | undefined,
          lifestylePrefs: profileData.lifestylePrefs as string[] | undefined,
          datingPrefs: profileData.datingPrefs as string[] | undefined,
          verificationStatus: "UNVERIFIED"
        }
      }
    },
    include: { profiles: true }
  });
}

async function main() {
  await prisma.like.deleteMany();
  await prisma.pass.deleteMany();
  await prisma.match.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  await createUser("mila@example.com", "Mila", "Mila", "France", "Paris", {
    age: 29,
    occupation: "Product Designer",
    relationshipGoal: "Long-term",
    languages: ["English", "French"],
    interests: ["Travel", "Art", "Music"],
    hobbies: ["Hiking", "Cooking", "Photography"],
    travelInterests: ["Europe", "Japan"],
    lifestylePrefs: ["Active", "Creative"],
    datingPrefs: ["Open to international", "Culture"]
  });

  await createUser("omar@example.com", "Omar", "Omar", "UAE", "Dubai", {
    age: 31,
    occupation: "Engineer",
    relationshipGoal: "Long-term",
    languages: ["English", "Arabic"],
    interests: ["Travel", "Tech", "Music"],
    hobbies: ["Running", "Cooking", "Photography"],
    travelInterests: ["Europe", "Italy"],
    lifestylePrefs: ["Active", "Ambitious"],
    datingPrefs: ["Open to international", "Travel"]
  });

  await createUser("sofia@example.com", "Sofia", "Sofia", "Spain", "Barcelona", {
    age: 27,
    occupation: "Marketing Lead",
    relationshipGoal: "Casual dating",
    languages: ["Spanish", "English"],
    interests: ["Art", "Food", "Travel"],
    hobbies: ["Dancing", "Yoga", "Coffee"],
    travelInterests: ["Europe", "Mexico"],
    lifestylePrefs: ["Creative", "Balanced"],
    datingPrefs: ["Travel", "Culture"]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
