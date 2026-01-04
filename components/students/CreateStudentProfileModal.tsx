"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ControlledInput from "../inputFields/ControlledInput";
import { Field } from "@/schemas/dynamicSchema";
import { CustomButton } from "../clickable/CustomButton";
import { ControlledSelect } from "../inputFields/ControlledSelect";
import useDynamicForm from "@/hooks/useDynamicForm";
import { toast } from "sonner";
import { useUser } from "@/api/user";
import { techStack } from "@/lib/data";
import { useStudents } from "@/api/student";
import { useAuth } from "@/api/auth";
import { useState } from "react";
import { useWatch } from "react-hook-form";

interface CreateStudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fields: Field[] = [
  {
    name: "email",
    type: "text",
    errorMessage: "Email is required",
    isRequired: true,
  },
  {
    name: "name",
    type: "text",
    errorMessage: "Username is required",
    isRequired: true,
  },
  {
    name: "techTrack",
    type: "text",
    errorMessage: "Track is required",
    isRequired: true,
  },
  {
    name: "country",
    type: "text",
    errorMessage: "Country is required",
    isRequired: true,
  },
  {
    name: "customTrack",
    type: "text",
    errorMessage: "Please specify your track",
    isRequired: false,
  },
];

export function CreateStudentProfileModal({
  isOpen,
  onClose,
}: CreateStudentProfileModalProps) {
  const { getCurrentUser } = useUser();
  const { getAllCountries } = useAuth();
  const { createStudentProfile } = useStudents();
  const { data, refetch } = getCurrentUser();
  const { data: count } = getAllCountries();
  const countriesData = count;

  const countryOptions =
    countriesData?.map((country) => ({
      value: country.code,
      label: country.name,
    })) || [];

  const { control, handleSubmit } = useDynamicForm(fields, {
    email: data?.email,
    name: data?.name,
    country: data?.country,
  });

  const selectedTrack = useWatch({
    control,
    name: "techTrack",
  });

  const { isPending, mutateAsync } = createStudentProfile;

  const handleCreateProfile = async (data: any) => {
    const finalTrack = data.techTrack === "other" ? data.customTrack : data.techTrack;

    if (!finalTrack) {
      toast.error("Please specify your track");
      return;
    }

    const payload = {
      ...data,
      techTrack: finalTrack,
      avatar:
        "https://img.freepik.com/free-vector/smiling-young-man-glasses_1308-174702.jpg?semt=ais_hybrid&w=740&q=80",
    };
    try {
      await mutateAsync(payload, {
        onSuccess: (response: any) => {
          console.log(response, "res_");
          toast.success("Learner Profile Created Successfully");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Learner Profile</DialogTitle>
          <DialogDescription>
            Let’s get you started. Create your learner profile to access your
            dashboard, track progress, and connect with mentors.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCreateProfile)}
          className="space-y-4"
        >
          <ControlledInput
            name="name"
            control={control}
            placeholder="Enter full name"
            type="text"
            label="Full Name"
            variant="primary"
            rules={{ required: true }}
          />
          <ControlledInput
            name="email"
            control={control}
            placeholder="you@example.com"
            type="text"
            label="Email Address"
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
            options={[...techStack, { value: "other", label: "Other (Specify)" }]}
            control={control}
            variant="primary"
            placeholder="__"
          />

          {selectedTrack === "other" && (
            <ControlledInput
              name="customTrack"
              control={control}
              placeholder="e.g. AI Engineering"
              type="text"
              label="Specify Your Track"
              variant="primary"
              rules={{ required: "Please specify your track" }}
            />
          )}

          <CustomButton
            type="submit"
            label="Create Profile"
            className="w-full rounded-[10px]"
            disabled={isPending}
            isLoading={isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
