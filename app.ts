import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async registerUser(user: User, password: string): Promise<string> {
        if (this.findUser(user.email)) {
            throw new Error('Duplicate user.');
        }

        user.id = crypto.randomUUID();
        user.password = await this.hashPassword(password);
        this.users.push(user);
        
        return user.id;
    }

    async authenticateUser(userId: string, password: string): Promise<boolean> {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            return await bcrypt.compare(password, user.password);
        }
        return false;
    }

    listUsers(): User[] {
        return this.users;
    }

    listRents(): Rent[] {
        return this.rents;
    }

    listBikes(): Bike[] {
        return this.bikes;
    }

    registerBike(bike: Bike): string {
        bike.id = crypto.randomUUID();
        this.bikes.push(bike);
        return bike.id;
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        } else {
            throw new Error('User does not exist.');
        }
    }

    rentBike(bikeId: string, userEmail: string, startDate: Date, endDate: Date): void {
        const bike = this.bikes.find(b => b.id === bikeId);
        const user = this.findUser(userEmail);

        if (!bike) {
            throw new Error('Bike not found.');
        }

        if (!user) {
            throw new Error('User not found.');
        }

        const overlappingRent = this.rents.find(rent =>
            rent.bike.id === bikeId &&
            !rent.dateReturned &&
            (startDate <= rent.dateTo && endDate >= rent.dateFrom)
        );

        if (overlappingRent) {
            throw new Error('Overlapping dates.');
        }

        const newRent = Rent.create(this.rents, bike, user, startDate, endDate);
        this.rents.push(newRent);
    }

    returnBike(bikeId: string, userEmail: string) {
        const today = new Date();
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.dateReturned &&
            rent.dateFrom <= today
        );
        
        if (rent) {
            rent.dateReturned = today;
        } else {
            throw new Error('Rent not found.');
        }
    }
}
