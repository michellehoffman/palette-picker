exports.seed = function(knex, Promise) {
  return knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    return Promise.all([
      knex('projects').insert({ name: 'Project 1' }, 'id')
      .then(project => {
        return knex('palettes').insert([
          {
            name: 'Fire',
            colors: ['#000000', '#FFFFFF', '#FCF015', '#EF4AB7', '#3AD784'],
            project_id: project[0]
          }
        ])
      })
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${ error }`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${ error }`))
};