import bcrypt from 'bcrypt';

async function main() {
  const password = 'P@ssw0rd123!';
  const saltRounds = 12;

  const hash = await bcrypt.hash(password, saltRounds);
  const ok = await bcrypt.compare(password, hash);
  const bad = await bcrypt.compare('wrong-password', hash);

  console.log('hash:', hash);
  console.log('compare ok:', ok);
  console.log('compare bad:', bad);

  if (!ok || bad) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
