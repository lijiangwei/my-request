// 对请求参数做处理，实现 query 简化、 post 简化
export default function simpleGetMiddleware(ctx, next) {
  if (!ctx) return next();
  const { req: { options = {} } = {} } = ctx;
  const { params } = options;
  // 将 method 改为大写
  options.method = options.method ? options.method.toUpperCase() : 'GET';
  options.data = params;

  ctx.req.options = options;

  return next();
}
