import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import AdvancedImg from "../../assets/Advanced.png";
import ZeroFees from "../../assets/zero_fees_us.png";
import CB from "../../assets/CB_LOLP__1_.png";

const GridSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        {/* First Row: Advanced trading */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12">
          <div className="w-full md:w-1/2">
            <img
              src={AdvancedImg}
              alt="Advanced Trading Platform"
              loading="eager"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center gap-6">
            <h2 className="text-display-3 md:text-display-2 m-0">
              Powerful tools, designed for the advanced trader.
            </h2>
            <p className="text-body text-gray-60 max-w-lg">
              Powerful analytical tools with the safety and security of Coinbase
              deliver the ultimate trading experience. Tap into sophisticated
              charting capabilities, real-time order books, and deep liquidity
              across hundreds of markets.
            </p>
            <div>
              <Button
                variant="secondary"
                size="md"
                className="!bg-black !text-white hover:!bg-gray-80"
              >
                Start trading
              </Button>
            </div>
          </div>
        </div>

        {/* Second Row: Coinbase One / Zero fees */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 mb-12">
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-6">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-500 w-max">
              <span className="font-semibold">C</span>
              COINBASE ONE
            </div>

            <h3 className="text-display-3 md:text-display-2 m-0">
              Zero trading fees, more rewards.
            </h3>

            <p className="text-body text-gray-60 max-w-md">
              Get more out of crypto with one membership: zero trading fees,
              boosted rewards, priority support, and more.
            </p>

            <div>
              <Button
                variant="primary"
                size="md"
                className="!bg-black !text-white"
              >
                Claim free trial
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-gray-15 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={ZeroFees}
                alt="Coinbase One benefits screenshot"
                loading="eager"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Third Row: Base App */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-sm bg-gray-15 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={CB}
                alt="Base App screenshot"
                loading="eager"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center gap-6">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-500 w-max">
              <span className="font-semibold">C</span>
              BASE APP
            </div>

            <h3 className="text-display-3 md:text-display-2 m-0">
              Countless ways to earn crypto with the Base App.
            </h3>

            <p className="text-body text-gray-60 max-w-md">
              An everything app to trade, create, discover, and chat, all in one
              place.
            </p>

            <div>
              <Button
                variant="tertiary"
                size="md"
                className="!bg-black !text-white"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GridSection;
