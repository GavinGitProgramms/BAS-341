import { AppDataSource } from '../src/data-source'
import { UserType, User } from '../src/entity'

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...')
    const user = new User()
    user.username = 'test'
    user.type = UserType.REGULAR
    user.first_name = 'Foo'
    user.last_name = 'Bar'
    user.email = 'foo@bar.dev'
    user.phone_number = '+1 608 781-8181'
    user.password_hash = 'abcd'
    await AppDataSource.manager.save(user)
    console.log('Saved a new user: ' + user.username)

    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)

    console.log(
      'Here you can setup and run express / fastify / any other framework.',
    )
  })
  .catch((error) => console.log(error))
