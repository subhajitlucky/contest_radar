# ContestRadar browser extension

A minimal Manifest V3 popup that shows the next five contests from the
ContestRadar API.

## Load locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `extension/` directory.
4. Pin the extension and open the popup.

The popup fetches `https://contestradar.vercel.app/api/contests`. It does not
store tokens, accounts, or browsing data. `storage` is declared only for the
future refresh timestamp.
