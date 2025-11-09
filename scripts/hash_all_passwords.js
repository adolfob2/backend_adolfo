// scripts/hash_all_passwords.js
import bcrypt from "bcrypt";
import orm from "../config/sequelize.js";

async function hashAllPasswords() {
  try {
    console.log("Conectando a la base de datos...");
    await orm.authenticate();

    const [users] = await orm.query("SELECT id_persona, password FROM usuarios");

    for (const user of users) {
      const pass = user.password || "";

      // Si ya está hasheado, lo saltamos
      if (pass.startsWith("$2b$") || pass.startsWith("$2a$")) {
        console.log(`✔ ${user.id_persona} ya tiene password hasheado`);
        continue;
      }

      // Hasheamos y actualizamos
      const hashed = await bcrypt.hash(pass, 10);
      await orm.query("UPDATE usuarios SET password = ? WHERE id_persona = ?", {
        replacements: [hashed, user.id_persona],
      });

      console.log(`🔑 Password actualizado para usuario ID ${user.id_persona}`);
    }

    console.log("✅ Todos los passwords fueron revisados y hasheados correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el proceso:", error);
    process.exit(1);
  }
}

hashAllPasswords();
