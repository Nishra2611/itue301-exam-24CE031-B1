export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body. Please remove any duplicate curly braces {} or formatting errors.'
    })
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((item) => item.message)
    return res.status(400).json({ success: false, message: 'Validation failed', errors: messages })
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'A booking already exists for this trainer, date and time slot' })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}` })
  }

  console.error('Server error:', err.message)
  return res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' })

}
