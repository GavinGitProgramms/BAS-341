import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'

/**
 * Returns a function that sets the HTTP response status code and sends a JSON response with a message.
 *
 * @param statusCode - The HTTP status code to set in the response.
 * @returns A function that takes a Response object and a message string, sets the status code, and sends a JSON response with the message.
 */
function withStatus(statusCode: StatusCodes) {
  return (res: Response, message: string) =>
    res.status(statusCode).json({ message })
}

export const badRequest = withStatus(StatusCodes.BAD_REQUEST)

export const notFoundRequest = withStatus(StatusCodes.NOT_FOUND)

export const internalErrorRequest = withStatus(
  StatusCodes.INTERNAL_SERVER_ERROR,
)

/**
 * Returns a response with an HTTP 401 Unauthorized status code and a message.
 *
 * @param res - The response object.
 * @returns The response object with the HTTP 401 status code and message.
 */
export const unauthorizedRequest = (res: Response) =>
  withStatus(StatusCodes.UNAUTHORIZED)(res, 'Unauthorized access')
