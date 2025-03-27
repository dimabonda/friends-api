import type { Knex } from "knex";
const now = new Date()
const roles = [
    {
        name: 'User',
        description: 'Role assigned to standard users.',
        type: 'user',
        created_at: now,
        updated_at: now,
    },
]

export async function up(knex: Knex): Promise<void> {
    const existingRoles = await knex('up_roles');
    const roleTypes = existingRoles.map((r: { type: string; }) => r.type)
    for (const role of roles) {
        if (!roleTypes.includes(role.type)) {
            console.log("Set role", role)
            await knex('up_roles').insert(role);
        }
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex('up_roles')
    .where('type', 'user')
    .del();
}

