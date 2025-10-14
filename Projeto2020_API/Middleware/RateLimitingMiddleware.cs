using System.Collections.Concurrent;
using System.Net;

namespace Projeto2025_API.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ConcurrentDictionary<string, RateLimitInfo> _requests = new();
        private readonly int _maxRequests;
        private readonly TimeSpan _window;

        public RateLimitingMiddleware(RequestDelegate next, int maxRequests = 10, int windowMinutes = 1)
        {
            _next = next;
            _maxRequests = maxRequests;
            _window = TimeSpan.FromMinutes(windowMinutes);
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientIp = GetClientIpAddress(context);
            var key = $"{clientIp}:{context.Request.Path}";
            
            var now = DateTime.UtcNow;
            var requestInfo = _requests.GetOrAdd(key, _ => new RateLimitInfo());

            lock (requestInfo)
            {
                // Remove old requests outside the window
                requestInfo.Requests.RemoveAll(r => r < now - _window);
                
                if (requestInfo.Requests.Count >= _maxRequests)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    context.Response.Headers.Add("Retry-After", _window.TotalSeconds.ToString());
                    await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
                    return;
                }
                
                requestInfo.Requests.Add(now);
            }

            await _next(context);
        }

        private string GetClientIpAddress(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            
            // Check for forwarded headers (behind proxy/load balancer)
            if (context.Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim();
            }
            else if (context.Request.Headers.ContainsKey("X-Real-IP"))
            {
                ipAddress = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            }

            return ipAddress ?? "unknown";
        }

        private class RateLimitInfo
        {
            public List<DateTime> Requests { get; } = new();
        }
    }
}
