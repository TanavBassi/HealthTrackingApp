import { Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';

import * as serviceAccount from '../config/firebase-service-account.json';

@Injectable()
export class FirebaseService {
  public firestore: FirebaseFirestore.Firestore;

  constructor() {
    console.log('🔥 Initializing Firebase Service...');

    // PREVENT MULTIPLE INITIALIZATION
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });

      console.log('✅ Firebase Initialized Successfully');
    }

    this.firestore = admin.firestore();

    console.log('✅ Firestore Connected Successfully');
  }

  // GET USER BY EMAIL
  async getUserByEmail(email: string): Promise<any> {
    try {
      console.log('🔍 Searching User By Email:', email);

      const snapshot = await this.firestore
        .collection('users')
        .where('email', '==', email)
        .get();

      // USER NOT FOUND
      if (snapshot.empty) {
        console.log('❌ No user found with this email');

        return null;
      }

      // USER FOUND
      const doc = snapshot.docs[0];

      const userData = {
        id: doc.id,

        ...doc.data(),
      };

      console.log('✅ User Found:', userData);

      return userData;
    } catch (error) {
      console.log('❌ ERROR IN getUserByEmail:', error);

      throw error;
    }
  }

  // CREATE USER
  async createUser(userData: any): Promise<string> {
    try {
      console.log('📝 Creating New User...');

      console.log('User Data:', userData);

      const docRef = await this.firestore.collection('users').add(userData);

      console.log('✅ User Created Successfully');

      console.log('🆔 User ID:', docRef.id);

      return docRef.id;
    } catch (error) {
      console.log('❌ ERROR IN createUser:', error);

      throw error;
    }
  }

  // UPDATE USER
  async updateUser(
    userId: string,

    updateData: any,
  ) {
    try {
      console.log('🔄 Updating User:', userId);

      console.log('Update Data:', updateData);

      await this.firestore.collection('users').doc(userId).update(updateData);

      console.log('✅ USER UPDATED SUCCESSFULLY');

      return true;
    } catch (error) {
      console.log('❌ ERROR IN updateUser:', error);

      throw error;
    }
  }

  // GET USER BY ID
  async getUserById(userId: string): Promise<any> {
    try {
      console.log('🔍 GETTING USER BY ID:', userId);

      const doc = await this.firestore.collection('users').doc(userId).get();

      // USER NOT FOUND
      if (!doc.exists) {
        console.log('❌ USER NOT FOUND');

        return null;
      }

      // USER FOUND
      const userData = {
        id: doc.id,

        ...doc.data(),
      };

      console.log('✅ USER FOUND:', userData);

      return userData;
    } catch (error) {
      console.log('❌ ERROR IN getUserById:', error);

      throw error;
    }
  }
}
