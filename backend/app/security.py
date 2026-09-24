from passlib.context import CryptContext

# Prefer Argon2 for hashing (more secure and no 72-byte truncation), keep bcrypt
# as a fallback for existing hashes.
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(password, hashed_password)
    except Exception:
        # Fallback: some bcrypt installations cause passlib to fail when probing
        # the backend. If the stored hash looks like a bcrypt hash ($2b$/$2a$/etc),
        # verify using the bcrypt package directly. Bcrypt only supports the
        # first 72 bytes of the password — truncate accordingly.
        if isinstance(hashed_password, str) and hashed_password.startswith("$2"):
            try:
                import bcrypt as _bcrypt

                pw = password.encode("utf-8")
                if len(pw) > 72:
                    pw = pw[:72]
                return _bcrypt.checkpw(pw, hashed_password.encode("utf-8"))
            except Exception:
                return False
        raise
