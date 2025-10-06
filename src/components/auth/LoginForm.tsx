import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').min(1, 'Contraseña requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn, isLoading } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await signIn(data.email, data.password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="tu@email.com"
          label="Email"
          error={errors.email?.message}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          label="Contraseña"
          error={errors.password?.message}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
