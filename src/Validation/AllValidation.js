exports.ValidName = (name)=>{
    const NameRegex = /^[A-Za-z ]+$/;
    return NameRegex.test(name);
}

exports.ValidEmail = (email)=>{
    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return EmailRegex.test(email);
}

exports.ValidPassword = (password)=>{
    const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return PasswordRegex.test(password);
}