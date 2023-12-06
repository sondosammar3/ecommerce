import { roles } from "../../middleware/auth.js"

export const endPoint = {
    create: [roles.Admin],
    getAll: [roles.Admin],
    update: [roles.Admin],
    specific: [roles.Admin, roles.User]
}