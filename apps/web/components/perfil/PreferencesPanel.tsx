"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TopBar, TopBarTitle } from "@/components/layout/TopBar";
import { PageContainer } from "@/components/layout/PageContainer";
import type { User } from "@fisgou/shared";

const themeOptions = [
  { value: "auto", label: "Automático" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
] as const;

export function PreferencesPanel({ user }: { user: User }) {
  const [theme, setTheme] = useState<typeof themeOptions[number]["value"]>("auto");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [compactFeed, setCompactFeed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dmNotifications, setDmNotifications] = useState(true);

  return (
    <PageContainer className="pb-10">
      <TopBar>
        <TopBarTitle title="Preferências" subtitle="Ajuste o app do jeito que você usa." />
      </TopBar>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text">Conta</h2>
          <p className="mt-2 text-sm text-text-2">
            Seu perfil no Fisgou está visível como @{user.handle}. Ajustes de nome, bio e imagem ficam em editar perfil.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-bg p-4">
              <p className="text-sm font-semibold text-text">Nome</p>
              <p className="mt-1 text-sm text-text-2">{user.nome}</p>
            </div>
            <div className="rounded-3xl border border-border bg-bg p-4">
              <p className="text-sm font-semibold text-text">Handle</p>
              <p className="mt-1 text-sm text-text-2">@{user.handle}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text">Aparência</h2>
              <p className="mt-2 text-sm text-text-2">
                Escolha o tema e os ajustes de leitura que melhor funcionam para você.
              </p>
            </div>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              Mock UI
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="space-y-2 rounded-3xl border border-border bg-bg p-4">
              <p className="text-sm font-semibold text-text">Tema do app</p>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${
                      theme === option.value
                        ? "border-brand bg-brand/10 text-text"
                        : "border-border bg-bg text-text-2 hover:border-brand"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-2">
                O app usará o tema selecionado apenas como simulação de preferências.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleCard
                label="Alto contraste"
                description="Aumenta o contraste das cores para facilitar a leitura."
                active={highContrast}
                onToggle={() => setHighContrast((prev) => !prev)}
              />
              <ToggleCard
                label="Texto grande"
                description="Exibe fontes maiores para leitura mais confortável."
                active={largeText}
                onToggle={() => setLargeText((prev) => !prev)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text">Preferências do app</h2>
          <p className="mt-2 text-sm text-text-2">
            Ajuste o comportamento do feed e das notificações no seu painel.
          </p>

          <div className="mt-5 grid gap-3">
            <ToggleCard
              label="Feed compacto"
              description="Reduz o espaçamento entre as publicações para ver mais conteúdo por vez."
              active={compactFeed}
              onToggle={() => setCompactFeed((prev) => !prev)}
            />
            <ToggleCard
              label="Notificações no app"
              description="Ativa o recebimento de alertas fictícios para curtidas e mensagens."
              active={notificationsEnabled}
              onToggle={() => setNotificationsEnabled((prev) => !prev)}
            />
            <ToggleCard
              label="Notificações de DM"
              description="Ativa avisos de mensagens diretas no app."
              active={dmNotifications}
              onToggle={() => setDmNotifications((prev) => !prev)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-text">Acessibilidade</h2>
          <p className="mt-2 text-sm text-text-2">
            Ferramentas de acessibilidade para tornar a navegação mais confortável.
          </p>
          <div className="mt-4 rounded-3xl border border-border bg-bg p-4">
            <p className="text-sm font-semibold text-text">Modo alto contraste</p>
            <p className="mt-1 text-sm text-text-2">
              Esse painel mostra como um modo acessível poderia ser ativado no app.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary">Cancelar</Button>
          <Button>Salvar preferências</Button>
        </div>
      </div>
    </PageContainer>
  );
}

function ToggleCard({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full flex-col justify-between rounded-3xl border px-4 py-4 text-left transition-colors ${
        active ? "border-brand bg-brand/10" : "border-border bg-bg hover:border-brand"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        <p className="mt-1 text-sm text-text-2">{description}</p>
      </div>
      <span className="mt-4 inline-flex h-9 w-16 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-text-2">
        {active ? "Ativo" : "Inativo"}
      </span>
    </button>
  );
}
