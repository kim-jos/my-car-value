import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>
    ) {}

    create(email: string, password: string) {
        // Can save directly but created an instance first
        // 1) because it helps with validation before saving it in our db
        // 2) because it allows you to run hooks (check user.entity)
        const user = this.repo.create({email, password})
        return this.repo.save(user);
    }

    findOne(id: number) {
        if (!id) return null; // Need to return null cuz repo returns id of first user if id is null
        return this.repo.findOne(id);
    }

    find(email: string) {
        return this.repo.find({ email })
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found')
        
        Object.assign(user, attrs);
        // Using save instead of update to make use of hooks
        // Cons: accesses DB twice instead of once
        return this.repo.save(user);
    }
    
    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found');
        
        // Using remove instead of delete to make use of hooks
        // Cons: need to make 2 rounds to db
        return this.repo.remove(user);
    }
}