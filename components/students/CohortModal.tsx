"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/schemas/dynamicSchema";
import useDynamicForm from "@/hooks/useDynamicForm";
import { useAuth } from "@/api/auth";
import ControlledInput from "../inputFields/ControlledInput";
import { ControlledSelect } from "../inputFields/ControlledSelect";
import { techStack } from "@/lib/data";
import { CustomButton } from "../clickable/CustomButton";
import { toast } from "sonner";
import { useStudents } from "@/api/student";
import { useCohorts } from "@/api/cohorts";
import { useAuthStore } from "@/store/authStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

const fields: Field[] = [
  {
    name: "durationDays",
    type: "number",
    errorMessage: "Duration is required",
    isRequired: true,
  },
  {
    name: "startAt",
    type: "text",
    errorMessage: "Start Date is required",
    isRequired: true,
  },

  {
    name: "country",
    type: "text",
    errorMessage: "Country is required",
    isRequired: true,
  },
];

const CohortModal = ({ open, onClose }: Props) => {
  const { control, handleSubmit } = useDynamicForm(fields, {});
  const { getAllCountries } = useAuth();
  const { currentUser } = useAuthStore();
  const orgId = currentUser?.organizationId;
  const { createCohort } = useCohorts();
  const { getMyCohort } = useStudents();

  const { refetch } = getMyCohort()
  const { data } = getAllCountries();
  const countriesData = data;

  const countryOptions =
    countriesData?.map((country) => ({
      value: country.code,
      label: country.name,
    })) || [];

  const { isPending, mutateAsync } = createCohort(orgId);

  const handleCreateCohort = async (data: any) => {
    const payload = {
      ...data,
    };
    try {
      await mutateAsync(payload, {
        onSuccess: (response: any) => {
          console.log(response, "res_");
          toast.success("Cohort Created Successfully");
          refetch();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message);
        },
      });
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Your Cohort</DialogTitle>
          <DialogDescription>Stay Consistent</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateCohort)} className="space-y-4">
          <ControlledInput
            name="startAt"
            control={control}
            placeholder="Enter full name"
            type="date"
            label="Start Date"
            variant="primary"
            rules={{ required: true }}
          />
          <ControlledInput
            name="durationDays"
            control={control}
            placeholder="30"
            type="number"
            label="Duration"
            variant="primary"
            rules={{ required: true }}
          />

          <ControlledSelect
            name="country"
            label="Country"
            options={countryOptions}
            control={control}
            variant="primary"
            // placeholder="__"
            searchable
          />
          <ControlledSelect
            name="techTrack"
            label="Your Track"
            options={techStack}
            control={control}
            variant="primary"
            placeholder="__"
          />

          <CustomButton
            type="submit"
            label="Create Cohort"
            className="w-full rounded-[10px]"
            disabled={isPending}
            isLoading={isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CohortModal;
