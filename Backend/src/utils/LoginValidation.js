import validator from "validator";

const ValidateLoginData = (body) => {
    const { email, password } = body;

    if (!email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!validator.isEmail(email.trim())) {
        throw new Error("Invalid email address.");
    }

    if (!password) {
        throw new Error("Password is required.");
    }
};

export default ValidateLoginData;