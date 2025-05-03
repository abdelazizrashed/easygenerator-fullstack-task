export const UserCmd = {
    CREATE_USER: { cmd: 'create-user' },
    LIST_USER: { cmd: 'list-user' },
    GET_USER: { cmd: 'get-user' },
    GET_USER_BY_EMAIL_FOR_AUTH: { cmd: 'get-user-by-email-for-auth' },
    UPDATE_USER: { cmd: 'update-user' },
    DELETE_USER: { cmd: 'delete-user' },
};

export const AuthCmd = {
    VALIDATE_USER: { cmd: 'validate-user' },
    VALIDATE_TOKEN: { cmd: 'validate-token' },
};
