import logger from '../modules/logger.js'

export default function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    logger.info(
        `${req.method} ${req.originalUrl}` + 
        `\nHEADERS: ${JSON.stringify(req.headers)}` + 
        `\nBODY: ${JSON.stringify(req.body)}` +
        `\nTOKEN: ${token ? token : ''}`
    )
    next()
}