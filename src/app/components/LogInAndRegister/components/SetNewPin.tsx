// "use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Asterisk } from "lucide-react"
import React, { Dispatch, SetStateAction, useState } from "react"
import { FormStep } from "../LogIn_Register"
import { useForm } from "react-hook-form"

type NewPinForm = {
    pin: string
    confirmPin: string
}

export default function SetNewPin({
    step,
    setStep,
}: {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
}) {
    const [showPin, setShowPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<NewPinForm>()

    const onSubmit = (data: NewPinForm) => {
        console.log("New PIN:", data)
        // Save new pin logic
        setStep("login")
    }

    if (step !== "setNewPin") return null

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New PIN */}
            <div className="space-y-2">
                <label className="flex items-center text-[12px] font-medium text-gray-900">
                    Create new PIN <Asterisk className="h-3 w-3 text-red-500" />
                </label>
                <div className="relative">
                    <Input
                        type={showPin ? "text" : "password"}
                        placeholder="1234"
                        maxLength={4}
                        {...register("pin", {
                            required: "PIN is required",
                            minLength: { value: 4, message: "PIN must be 4 digits" },
                            maxLength: { value: 4, message: "PIN must be 4 digits" },
                        })}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPin(!showPin)}
                    >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                {errors.pin && <p className="text-xs text-red-500">{errors.pin.message}</p>}
            </div>

            {/* Confirm PIN */}
            <div className="space-y-2">
                <label className="flex items-center text-[12px] font-medium text-gray-900">
                    Confirm new PIN <Asterisk className="h-3 w-3 text-red-500" />
                </label>
                <div className="relative">
                    <Input
                        type={showConfirmPin ? "text" : "password"}
                        placeholder="1234"
                        maxLength={4}
                        {...register("confirmPin", {
                            required: "Please confirm your PIN",
                            validate: (value) => value === watch("pin") || "PINs do not match",
                        })}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                    >
                        {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                {errors.confirmPin && (
                    <p className="text-xs text-red-500">{errors.confirmPin.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Save New PIN
            </Button>
        </form>
    )
}
