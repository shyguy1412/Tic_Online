import { connect } from 'mongoose';

export const db = await connect('localhost:27017', { pass: 'pass', user: 'root' });