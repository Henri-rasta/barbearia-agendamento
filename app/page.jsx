import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock3, Phone, Scissors, User, Bell, CheckCircle2, XCircle, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const SERVICES = [
  { id: "corte", name: "Corte", duration: 45, price: 35 },
  { id: "barba", name: "Barba", duration: 30, price: 25 },
  { id: "combo", name: "Corte + Barba", duration: 60, price: 55 },
];

const DAYS = [
  { id: "2026-03-20", label: "20 Mar" },
  { id: "2026-03-21", label: "21 Mar" },
  { id: "2026-03-22", label: "22 Mar" },
];

const INITIAL_SLOTS = {
  "2026-03-20": ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
  "2026-03-21": ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "17:00"],
  "2026-03-22": ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
};

const INITIAL_BOOKINGS = [
  {
    id: 1,
    name: "Carlos Henrique",
    phone: "(11) 99999-1111",
    day: "2026-03-20",
    time: "10:00",
    service: "combo",
    status: "confirmado",
    whatsappNotified: true,
  },
  {
    id: 2,
    name: "Mateus Silva",
    phone: "(11) 98888-2222",
    day: "2026-03-20",
    time: "14:00",
    service: "corte",
    status: "confirmado",
    whatsappNotified: true,
  },
];

function serviceLabel(id) {
  return SERVICES.find((s) => s.id === id)?.name || id;
}

function priceLabel(id) {
  const service = SERVICES.find((s) => s.id === id);
  return service ? `R$ ${service.price}` : "-";
}

function statusColor(status) {
  if (status === "confirmado") return "bg-green-100 text-green-700 border-green-200";
  if (status === "cancelado") return "bg-red-100 text-red-700 border-red-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
}

export default function BarberSchedulingDemo() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0].id);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("combo");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [confirmation, setConfirmation] = useState(null);

  const bookedMap = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.status !== "cancelado")
      .forEach((b) => {
        map[`${b.day}-${b.time}`] = true;
      });
    return map;
  }, [bookings]);

  const availableSlots = useMemo(() => {
    return (INITIAL_SLOTS[selectedDay] || []).filter((time) => !bookedMap[`${selectedDay}-${time}`]);
  }, [selectedDay, bookedMap]);

  const dayBookings = useMemo(() => {
    return bookings
      .filter((b) => b.day === selectedDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [bookings, selectedDay]);

  const metrics = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelado");
    return {
      total: active.length,
      notified: active.filter((b) => b.whatsappNotified).length,
      today: active.filter((b) => b.day === selectedDay).length,
      revenue: active.reduce((sum, b) => {
        const svc = SERVICES.find((s) => s.id === b.service);
        return sum + (svc?.price || 0);
      }, 0),
    };
  }, [bookings, selectedDay]);

  function handleBooking() {
    if (!clientName || !clientPhone || !selectedDay || !selectedTime || !selectedService) return;

    const newBooking = {
      id: Date.now(),
      name: clientName,
      phone: clientPhone,
      day: selectedDay,
      time: selectedTime,
      service: selectedService,
      status: "confirmado",
      whatsappNotified: true,
    };

    setBookings((prev) => [...prev, newBooking]);
    setConfirmation(newBooking);
    setClientName("");
    setClientPhone("");
    setSelectedTime("");
  }

  function cancelBooking(id) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelado" } : b)));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-xl md:grid-cols-[1.4fr,0.6fr]"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <Scissors className="h-4 w-4" />
              Demonstração profissional de agenda para barbearia
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Sistema de agendamento online com painel do barbeiro</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
              Nesta demonstração, o cliente escolhe serviço, data e horário disponível. No painel do barbeiro, a agenda aparece organizada, com confirmação do envio de notificação por WhatsApp.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none">
              <CardContent className="p-4">
                <p className="text-sm text-slate-200">Agendamentos</p>
                <p className="mt-1 text-2xl font-bold">{metrics.total}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none">
              <CardContent className="p-4">
                <p className="text-sm text-slate-200">WhatsApp enviado</p>
                <p className="mt-1 text-2xl font-bold">{metrics.notified}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none">
              <CardContent className="p-4">
                <p className="text-sm text-slate-200">Do dia</p>
                <p className="mt-1 text-2xl font-bold">{metrics.today}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 bg-white/10 text-white shadow-none">
              <CardContent className="p-4">
                <p className="text-sm text-slate-200">Receita simulada</p>
                <p className="mt-1 text-2xl font-bold">R$ {metrics.revenue}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Tabs defaultValue="cliente" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white p-1 shadow-sm">
            <TabsTrigger value="cliente" className="rounded-xl">Área do cliente</TabsTrigger>
            <TabsTrigger value="barbeiro" className="rounded-xl">Painel do barbeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="cliente" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Agendar horário</CardTitle>
                  <CardDescription>Escolha o serviço, a data e um horário disponível.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do cliente</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input value={clientName} onChange={(e) => setClientName(e.target.value)} className="pl-9" placeholder="Ex.: João Henrique" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="pl-9" placeholder="Ex.: (11) 99999-0000" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Serviço</label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {SERVICES.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`rounded-2xl border p-4 text-left transition ${selectedService === service.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
                        >
                          <p className="font-semibold">{service.name}</p>
                          <p className={`mt-1 text-sm ${selectedService === service.id ? "text-slate-200" : "text-slate-500"}`}>{service.duration} min</p>
                          <p className="mt-3 text-sm font-medium">R$ {service.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Data</label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {DAYS.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => {
                            setSelectedDay(day.id);
                            setSelectedTime("");
                          }}
                          className={`flex items-center justify-between rounded-2xl border p-4 transition ${selectedDay === day.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
                        >
                          <span className="font-medium">{day.label}</span>
                          <Calendar className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Horários disponíveis</label>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {availableSlots.length ? (
                        availableSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${selectedTime === time ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-full rounded-2xl border border-dashed p-6 text-center text-sm text-slate-500">
                          Não há horários disponíveis nesta data.
                        </div>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full rounded-2xl py-6 text-base">
                    Confirmar agendamento
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-3xl border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Resumo do agendamento</CardTitle>
                    <CardDescription>Visão clara do que o cliente escolheu.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <span className="text-slate-500">Serviço</span>
                      <span className="font-semibold">{serviceLabel(selectedService)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <span className="text-slate-500">Preço</span>
                      <span className="font-semibold">{priceLabel(selectedService)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <span className="text-slate-500">Data</span>
                      <span className="font-semibold">{DAYS.find((d) => d.id === selectedDay)?.label}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <span className="text-slate-500">Horário</span>
                      <span className="font-semibold">{selectedTime || "Selecione"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>WhatsApp automático</CardTitle>
                    <CardDescription>Fluxo que será implementado na versão real.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <Bell className="mt-0.5 h-4 w-4" />
                      <p>Ao confirmar o agendamento, o sistema enviará uma mensagem no WhatsApp do barbeiro com nome do cliente, telefone, data, hora e serviço.</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      <p>Também poderá enviar confirmação para o cliente e lembrete automático antes do horário agendado.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {confirmation && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-3xl border-0 border-green-200 bg-green-50 shadow-md">
                  <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-green-800">Agendamento realizado com sucesso</p>
                      <p className="text-sm text-green-700">
                        {confirmation.name} agendou {serviceLabel(confirmation.service)} em {DAYS.find((d) => d.id === confirmation.day)?.label} às {confirmation.time}.
                      </p>
                    </div>
                    <Badge className="rounded-full border-green-200 bg-white text-green-700">WhatsApp enviado ao barbeiro</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="barbeiro" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LayoutDashboard className="h-5 w-5" /> Painel do dia</CardTitle>
                  <CardDescription>Selecione uma data para ver os clientes agendados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {DAYS.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDay(day.id)}
                        className={`rounded-2xl border p-4 text-left transition ${selectedDay === day.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-400"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{day.label}</span>
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <p className={`mt-1 text-sm ${selectedDay === day.id ? "text-slate-200" : "text-slate-500"}`}>
                          {(bookings.filter((b) => b.day === day.id && b.status !== "cancelado").length)} agendamento(s)
                        </p>
                      </button>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Horários livres</p>
                      <p className="mt-1 text-2xl font-bold">{availableSlots.length}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Agendados</p>
                      <p className="mt-1 text-2xl font-bold">{dayBookings.filter((b) => b.status !== "cancelado").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Lista de clientes agendados</CardTitle>
                  <CardDescription>Visualização que o barbeiro usará para organizar o atendimento.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dayBookings.length ? (
                    dayBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">{booking.name}</p>
                              <Badge className={`rounded-full border ${statusColor(booking.status)}`}>{booking.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                              <span className="rounded-full bg-slate-100 px-3 py-1">{booking.time}</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{serviceLabel(booking.service)}</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1">{booking.phone}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full border-blue-200 bg-blue-50 text-blue-700">
                              {booking.whatsappNotified ? "WhatsApp enviado" : "Pendente"}
                            </Badge>
                            {booking.status !== "cancelado" && (
                              <Button variant="outline" className="rounded-2xl" onClick={() => cancelBooking(booking.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
                      Nenhum cliente agendado nesta data.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
