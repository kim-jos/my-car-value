import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'

describe("AuthService", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    
    beforeEach(async () => {
        // Create fake usersService
        const users: User[] = [];
        
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 99999), email, password } as User
                users.push(user);
                return Promise.resolve(user);
            },
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
            ],
        }).compile();

        service = module.get(AuthService);
    })
    
    
    it('should create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('should create a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('should throw an error when if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrowError(BadRequestException)
    })

    it('should throw an error if signing in with unused email', async () => {
        await expect(service.signin('asasdfasdfdf@asdf.com', 'asdf')).rejects.toThrowError(NotFoundException);
        
        try {
            await service.signin('asdflkj@asdlfkj.com', 'passdflkj');
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
            expect(err.message).toBe('user not found');
        }
    })

    it('should throw an error is invalid password is used', async () => {
        await service.signup('asdf@asdf.com', 'asdf')
        await expect(service.signin('asdf@asdf.com', 'aaaa')).rejects.toThrowError(BadRequestException)
    })

    it('should return a user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', 'asdf')
        const user = await service.signin('asdf@asdf.com', 'asdf')
        expect(user).toBeDefined();
    })
})