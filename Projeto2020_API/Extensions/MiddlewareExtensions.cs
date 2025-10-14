using Projeto2025_API.Middleware;

namespace Projeto2025_API.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityHeadersMiddleware>();
        }

        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalExceptionMiddleware>();
        }

        public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder, int maxRequests = 10, int windowMinutes = 1)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>(maxRequests, windowMinutes);
        }
    }
}
