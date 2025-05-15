namespace MindMapBackend.Data.DTO
{
    public class AuthResult
    {
        public bool Succeeded { get; }
        public string Error { get; }
        public string Token { get; }
        public UserDTO User { get; }

        private AuthResult(bool succeeded, string error, string token, UserDTO user)
        {
            Succeeded = succeeded;
            Error = error;
            Token = token;
            User = user;
        }

        public static AuthResult Success(string token, UserDTO user)
            => new AuthResult(true, null, token, user);

        public static AuthResult Failure(string error)
            => new AuthResult(false, error, null, null);
    }
}
