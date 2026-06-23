import { useState } from "react";

import sleepIcon from "../icons/sleep.svg";
import restartIcon from "../icons/restart.svg";
import auraLogo from "../icons/aura-logo.svg";
import notesIcon from "../icons/notes.svg";
import folderIcon from "../icons/folder.svg";
import calculatorIcon from "../icons/calculator.svg";
import auraAIIcon from "../icons/aura-ai.svg";
import rocketIcon from "../icons/rocket.svg";
import settingsIcon from "../icons/settings.svg";
import musicIcon from "../icons/auramusic.svg";

function AuraHub({
  onClose,
  openNotes,
  openExplorer,
  openCalculator,
  openAuraAI,
  openAuraCommand,
  openAuraMusic,
  openSettings,
  onSleep,
  onRestart,
  onShutdown,
  onEmergency,
}) {
  const [powerOpen, setPowerOpen] =
    useState(false);

  return (
    <div
      className="aura-hub-overlay"
      onClick={onClose}
    >
      <div
        className="aura-hub"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="hub-header">
          <img
            src={auraLogo}
            alt="AuraOS"
            className="hub-logo"
          />

          <div>
            <h2>AuraOS</h2>
            <span>
              Bridge Interface
            </span>
          </div>
        </div>

        <input
          className="hub-search"
          placeholder="Search systems..."
        />

        <div className="hub-app-grid">

          <div
            className="hub-app"
            onClick={() => {
              openAuraCommand();
              onClose();
            }}
          >
            <img
              src={rocketIcon}
              alt=""
            />
            <span>
              Aura Command
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openAuraAI();
              onClose();
            }}
          >
            <img
              src={auraAIIcon}
              alt=""
            />
            <span>
              Aura AI
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openExplorer();
              onClose();
            }}
          >
            <img
              src={folderIcon}
              alt=""
            />
            <span>
              Explorer
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openNotes();
              onClose();
            }}
          >
            <img
              src={notesIcon}
              alt=""
            />
            <span>
              Notes
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openCalculator();
              onClose();
            }}
          >
            <img
              src={calculatorIcon}
              alt=""
            />
            <span>
              Calculator
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openSettings();
              onClose();
            }}
          >
            <img
              src={settingsIcon}
              alt=""
            />
            <span>
              Settings
            </span>
          </div>

          <div
            className="hub-app"
            onClick={() => {
              openAuraMusic();
              onClose();
            }}
          >
            <img
              src={musicIcon}
              alt=""
            />
            <span>
              Aura Music
            </span>
          </div>

        </div>

        <div className="hub-footer">

          <div className="hub-user">
            Captain
          </div>

          <div className="power-menu-container">

            <button
              className="power-toggle"
              onClick={() =>
                setPowerOpen(!powerOpen)
              }
            >
              ☰
            </button>

            {powerOpen && (
              <div className="power-menu">

                <button
                  onClick={() => {
                    onSleep?.();
                    setPowerOpen(false);
                    onClose();
                  }}
                >
                  <img
                    src={sleepIcon}
                    alt=""
                  />
                  Sleep
                </button>

                <button
                  onClick={() => {
                    onRestart?.();
                    setPowerOpen(false);
                    onClose();
                  }}
                >
                  <img
                    src={restartIcon}
                    alt=""
                  />
                  Restart
                </button>

                <button
                  onClick={() => {
                    onShutdown?.();
                    setPowerOpen(false);
                    onClose();
                  }}
                >
                  ⏻ Shutdown
                </button>

                <button
                  className="emergency-btn"
                  onClick={() => {
                    onEmergency?.();
                    setPowerOpen(false);
                    onClose();
                  }}
                >
                  ⚠ Emergency Mode
                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuraHub;