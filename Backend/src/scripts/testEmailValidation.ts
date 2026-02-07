// Lightweight checks mirroring signup email validation logic

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const valid = [
  'a@b.com',
  'Test.User+tag@example.co.uk',
  'USER@EXAMPLE.COM',
];

const invalid = [
  '',
  '   ',
  'no-at-symbol.com',
  'a@b',
  'a@b.',
  'a@@b.com',
  'a b@c.com',
];

function check(email: string) {
  const normalized = String(email).trim().toLowerCase();
  return emailRegex.test(normalized);
}

let ok = true;

for (const e of valid) {
  if (!check(e)) {
    console.error('Expected valid but failed:', e);
    ok = false;
  }
}

for (const e of invalid) {
  if (check(e)) {
    console.error('Expected invalid but passed:', e);
    ok = false;
  }
}

if (ok) {
  console.log('Email validation checks: PASS');
} else {
  console.log('Email validation checks: FAIL');
  process.exitCode = 1;
}
