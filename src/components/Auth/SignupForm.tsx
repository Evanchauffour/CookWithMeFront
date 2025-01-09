'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/apiServices/auh';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { IoIosWarning } from 'react-icons/io';
import { z } from 'zod';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(1, "Le nom est requis."), 
  email: z.string().email("L'email est requis et doit être valide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export default function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors({});
        setServerError(null);

        try {
            signupSchema.parse({ name, email, password });

            await signup(name, email, password);
            router.push('/');
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                err.errors.forEach((error) => {
                    if (error.path[0]) {
                        fieldErrors[error.path[0]] = error.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                setServerError(err.message || 'An unexpected error occurred.');
            }
        }
    };

    return (
        <div className='m-auto flex flex-col items-center gap-8 bg-white p-4 rounded-xl shadow-2xl w-[400px]'>
            <h1 className='text-4xl font-bold'>Inscription</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                <Input
                    label='Nom'
                    type='text'
                    placeholder='Nom'
                    id='name'
                    name='name'
                    value={name}
                    onChange={setName}
                />
                {errors.email && (
                    <p className='text-red-500 flex gap-2 items-center text-sm'>
                        <IoIosWarning />
                        {errors.name}
                    </p>
                )}
                <Input
                    label='Email'
                    type='email'
                    placeholder='Email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={setEmail}
                />
                {errors.email && (
                    <p className='text-red-500 flex gap-2 items-center text-sm'>
                        <IoIosWarning />
                        {errors.email}
                    </p>
                )}
                <Input
                    label='Password'
                    type='password'
                    placeholder='Password'
                    id='password'
                    name='password'
                    value={password}
                    onChange={setPassword}
                />
                {errors.password && (
                    <p className='text-red-500 flex gap-2 items-center text-sm'>
                        <IoIosWarning />
                        {errors.password}
                    </p>
                )}
                {serverError && (
                    <p className='text-red-500 flex gap-2 items-center text-sm'>
                        <IoIosWarning />
                        {serverError}
                    </p>
                )}
                <Button label='Inscription' />
                <p className='text-center'>Déjà un compte ? <Link href='/login'>Se connecter</Link></p>
            </form>
        </div>
    );
}
