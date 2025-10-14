namespace Projeto2025_API.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Prevent clickjacking
            context.Response.Headers.Add("X-Frame-Options", "DENY");
            
            // Prevent MIME type sniffing
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            
            // XSS Protection
            context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
            
            // Referrer Policy
            context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // Content Security Policy
            context.Response.Headers.Add("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "connect-src 'self' https:; " +
                "frame-ancestors 'none';");
            
            // Strict Transport Security (only for HTTPS)
            if (context.Request.IsHttps)
            {
                context.Response.Headers.Add("Strict-Transport-Security", 
                    "max-age=31536000; includeSubDomains; preload");
            }
            
            // Permissions Policy
            context.Response.Headers.Add("Permissions-Policy", 
                "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()");

            await _next(context);
        }
    }
}
