import { User } from "../users/user.entity";
import { ManyToOne, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ default: false })
    approved: boolean
    
    @Column()
    price: number;
    
    @Column()
    make: string;
    
    @Column()
    model: string;
    
    @Column()
    year: number;
    
    @Column()
    lng: number;
    
    @Column()
    lat: number;
    
    @Column()
    mileage: number;

    // many reports one user 
    @ManyToOne(() => User, (user) => user.reports) 
    user: User;
}