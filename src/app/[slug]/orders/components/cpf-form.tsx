"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import z from "zod";
import { isValidCpf, removeCpfMask } from "../../menu/helpers/cpf";
const formSchema = z.object({
  cpf: z
    .string()
    .trim()
    .min(1, { message: "O CPF é obrigatório" })
    .refine((value) => isValidCpf(value), "CPF inválido"),
});
interface FinishOrderButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");
  const pathname = usePathname();
  const onSubmit = (data: FormSchema) => {
    router.replace(
      `${pathname}?cpf=${removeCpfMask(
        data.cpf
      )}&consumptionMethod=${consumptionMethod}`
    );
  };
  const handleCancel = () => {
    router.back();
  };
  return (
    <Drawer open>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Visulizar Pedidos</DrawerTitle>
          <DrawerDescription>
            Insira seu CPF abaixo para visualizar seus pedidos
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="px-4">
                  <FormLabel>Seu CPF</FormLabel>
                  <FormControl>
                    <PatternFormat
                      placeholder="Digite seu CPF..."
                      format="###.###.###-##"
                      customInput={Input}
                      mask="_"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter>
              <Button variant="destructive" className="w-full rounded-full">
                Confirmar
              </Button>
              <DrawerClose>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default CpfForm;
