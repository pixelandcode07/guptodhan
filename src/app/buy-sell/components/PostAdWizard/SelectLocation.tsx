'use client';

import { Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LocationDataProps } from '@/types/locationType';



export default function SelectLocation({
    control,
    register,
    watch,
    divisionOptions,
    cityOptions,
    areaOptions,
    selectedDivision,
    selectedCity,
    onBack,
    onNext,
}: LocationDataProps) {
    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <TabsContent value="step2">
            <AnimatePresence mode="wait">
                <motion.div
                    key="location-step"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 md:px-20">
                        <div>
                            <Label className="mb-2">Division</Label>
                            <Controller
                                name="division"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={divisionOptions} />
                                )}
                            />
                        </div>
                        <div>
                            <Label className="mb-2">District</Label>
                            <Controller
                                name="district"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={cityOptions} isDisabled={!selectedDivision} />
                                )}
                            />
                        </div>
                        <div>
                            <Label className="mb-2">Area</Label>
                            <Controller
                                name="upazila"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={areaOptions} isDisabled={!selectedCity} />
                                )}
                            />
                        </div>
                    </div>

                    <div className="px-5 md:px-20">
                        <Label className="mb-2">Details</Label>
                        <Textarea {...register('details')} placeholder="Write your address..." />
                    </div>

                    <div className="flex justify-between mt-6 px-5 md:px-20">
                        <Button type="button" variant="outline" onClick={onBack}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (selectedDivision && selectedCity && watch('upazila')) onNext();
                                else toast.error('Please fill location');
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </TabsContent>
    );
}
