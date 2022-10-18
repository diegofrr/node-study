export function formattedSchemaError(err) {
    return {
        error: {
            path: err.path,
            message: err.errors
        }
    }
}