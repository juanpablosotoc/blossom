// Import ALL components you might reference in JSX
import VideoAudio from './components/VideoAudio';
import Audio from './components/audio';
import BigLi from './components/bigLi';
import BigUl from './components/bigUl';
import Code from './components/code';
import ConceptMap from './components/conceptmap';
import Frame from './components/frame';
import Image from './components/image';
import InfoLink from './components/infoLink';
import Math from './components/math';
import MyNode from './components/myNode';
import MyTooltip from './components/mytooltip';
import Quote from './components/quote';
import SpeedReader from './components/speedReader';
import Timeline from './components/timeline';
import TimelineEvent from './components/timelineEvent';
import Video from './components/video';
import VideoAudioNav from './components/videoAudioNav';


export default function Output1() {
    return (
        <>

        <Audio title="Introduction" src="https://cherry-blossom.s3.mx-central-1.amazonaws.com/bd651a8c-4799-4f16-8236-b6d09094643f.mp3" transcript="[{&quot;end&quot;: 0.1599999964237213, &quot;start&quot;: 0.0, &quot;word&quot;: &quot;Do&quot;}, {&quot;end&quot;: 0.3400000035762787, &quot;start&quot;: 0.1599999964237213, &quot;word&quot;: &quot;you&quot;}, {&quot;end&quot;: 0.5199999809265137, &quot;start&quot;: 0.3400000035762787, &quot;word&quot;: &quot;mean&quot;}, {&quot;end&quot;: 0.8799999952316284, &quot;start&quot;: 0.5199999809265137, &quot;word&quot;: &quot;medicine&quot;}, {&quot;end&quot;: 1.1799999475479126, &quot;start&quot;: 0.8799999952316284, &quot;word&quot;: &quot;as&quot;}, {&quot;end&quot;: 1.4199999570846558, &quot;start&quot;: 1.1799999475479126, &quot;word&quot;: &quot;the&quot;}, {&quot;end&quot;: 1.7200000286102295, &quot;start&quot;: 1.4199999570846558, &quot;word&quot;: &quot;field&quot;}, {&quot;end&quot;: 2.380000114440918, &quot;start&quot;: 1.940000057220459, &quot;word&quot;: &quot;healthcare&quot;}, {&quot;end&quot;: 2.940000057220459, &quot;start&quot;: 2.940000057220459, &quot;word&quot;: &quot;doctors&quot;}, {&quot;end&quot;: 3.4600000381469727, &quot;start&quot;: 3.140000104904175, &quot;word&quot;: &quot;research&quot;}, {&quot;end&quot;: 3.9200000762939453, &quot;start&quot;: 3.700000047683716, &quot;word&quot;: &quot;or&quot;}, {&quot;end&quot;: 4.139999866485596, &quot;start&quot;: 3.9200000762939453, &quot;word&quot;: &quot;a&quot;}, {&quot;end&quot;: 4.559999942779541, &quot;start&quot;: 4.139999866485596, &quot;word&quot;: &quot;medicine&quot;}, {&quot;end&quot;: 5.21999979019165, &quot;start&quot;: 4.840000152587891, &quot;word&quot;: &quot;a&quot;}, {&quot;end&quot;: 5.21999979019165, &quot;start&quot;: 5.21999979019165, &quot;word&quot;: &quot;drug&quot;}, {&quot;end&quot;: 6.340000152587891, &quot;start&quot;: 5.960000038146973, &quot;word&quot;: &quot;I'll&quot;}, {&quot;end&quot;: 6.559999942779541, &quot;start&quot;: 6.340000152587891, &quot;word&quot;: &quot;describe&quot;}, {&quot;end&quot;: 6.840000152587891, &quot;start&quot;: 6.559999942779541, &quot;word&quot;: &quot;the&quot;}, {&quot;end&quot;: 6.960000038146973, &quot;start&quot;: 6.840000152587891, &quot;word&quot;: &quot;field&quot;}, {&quot;end&quot;: 7.420000076293945, &quot;start&quot;: 6.960000038146973, &quot;word&quot;: &quot;briefly&quot;}, {&quot;end&quot;: 8.180000305175781, &quot;start&quot;: 8.180000305175781, &quot;word&quot;: &quot;Tell&quot;}, {&quot;end&quot;: 8.34000015258789, &quot;start&quot;: 8.180000305175781, &quot;word&quot;: &quot;me&quot;}, {&quot;end&quot;: 8.520000457763672, &quot;start&quot;: 8.34000015258789, &quot;word&quot;: &quot;if&quot;}, {&quot;end&quot;: 8.720000267028809, &quot;start&quot;: 8.520000457763672, &quot;word&quot;: &quot;you&quot;}, {&quot;end&quot;: 8.819999694824219, &quot;start&quot;: 8.720000267028809, &quot;word&quot;: &quot;want&quot;}, {&quot;end&quot;: 9.100000381469727, &quot;start&quot;: 8.819999694824219, &quot;word&quot;: &quot;more&quot;}, {&quot;end&quot;: 9.460000038146973, &quot;start&quot;: 9.100000381469727, &quot;word&quot;: &quot;detail&quot;}, {&quot;end&quot;: 9.739999771118164, &quot;start&quot;: 9.460000038146973, &quot;word&quot;: &quot;about&quot;}, {&quot;end&quot;: 10.020000457763672, &quot;start&quot;: 9.739999771118164, &quot;word&quot;: &quot;a&quot;}, {&quot;end&quot;: 10.319999694824219, &quot;start&quot;: 10.020000457763672, &quot;word&quot;: &quot;specific&quot;}, {&quot;end&quot;: 10.699999809265137, &quot;start&quot;: 10.319999694824219, &quot;word&quot;: &quot;part&quot;}]"/><Video title="What medicine is" audioSrc="https://cherry-blossom.s3.mx-central-1.amazonaws.com/36ea520d-faca-4a12-bf23-3a481f92c183.mp3" transcript="[{&quot;end&quot;: 0.4000000059604645, &quot;start&quot;: 0.0, &quot;word&quot;: &quot;Medicine&quot;}, {&quot;end&quot;: 0.6399999856948853, &quot;start&quot;: 0.4000000059604645, &quot;word&quot;: &quot;is&quot;}, {&quot;end&quot;: 0.8799999952316284, &quot;start&quot;: 0.6399999856948853, &quot;word&quot;: &quot;the&quot;}, {&quot;end&quot;: 1.1399999856948853, &quot;start&quot;: 0.8799999952316284, &quot;word&quot;: &quot;science&quot;}, {&quot;end&quot;: 1.4800000190734863, &quot;start&quot;: 1.1399999856948853, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 1.6200000047683716, &quot;start&quot;: 1.4800000190734863, &quot;word&quot;: &quot;practice&quot;}, {&quot;end&quot;: 1.940000057220459, &quot;start&quot;: 1.6200000047683716, &quot;word&quot;: &quot;of&quot;}, {&quot;end&quot;: 2.240000009536743, &quot;start&quot;: 1.940000057220459, &quot;word&quot;: &quot;preventing&quot;}, {&quot;end&quot;: 3.0999999046325684, &quot;start&quot;: 3.0999999046325684, &quot;word&quot;: &quot;diagnosing&quot;}, {&quot;end&quot;: 3.700000047683716, &quot;start&quot;: 3.700000047683716, &quot;word&quot;: &quot;treating&quot;}, {&quot;end&quot;: 4.5, &quot;start&quot;: 3.9600000381469727, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 4.5, &quot;start&quot;: 4.5, &quot;word&quot;: &quot;managing&quot;}, {&quot;end&quot;: 4.940000057220459, &quot;start&quot;: 4.5, &quot;word&quot;: &quot;illness&quot;}, {&quot;end&quot;: 5.300000190734863, &quot;start&quot;: 4.940000057220459, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 5.579999923706055, &quot;start&quot;: 5.300000190734863, &quot;word&quot;: &quot;preserving&quot;}, {&quot;end&quot;: 6.0, &quot;start&quot;: 5.579999923706055, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 6.679999828338623, &quot;start&quot;: 6.380000114440918, &quot;word&quot;: &quot;It&quot;}, {&quot;end&quot;: 7.199999809265137, &quot;start&quot;: 6.679999828338623, &quot;word&quot;: &quot;combines&quot;}, {&quot;end&quot;: 7.940000057220459, &quot;start&quot;: 7.199999809265137, &quot;word&quot;: &quot;biological&quot;}, {&quot;end&quot;: 8.399999618530273, &quot;start&quot;: 7.940000057220459, &quot;word&quot;: &quot;sciences&quot;}, {&quot;end&quot;: 9.260000228881836, &quot;start&quot;: 9.180000305175781, &quot;word&quot;: &quot;clinical&quot;}, {&quot;end&quot;: 9.800000190734863, &quot;start&quot;: 9.260000228881836, &quot;word&quot;: &quot;practice&quot;}, {&quot;end&quot;: 10.579999923706055, &quot;start&quot;: 10.579999923706055, &quot;word&quot;: &quot;public&quot;}, {&quot;end&quot;: 10.960000038146973, &quot;start&quot;: 10.579999923706055, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 11.699999809265137, &quot;start&quot;: 11.699999809265137, &quot;word&quot;: &quot;ethics&quot;}, {&quot;end&quot;: 12.239999771118164, &quot;start&quot;: 11.880000114440918, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 12.5, &quot;start&quot;: 12.239999771118164, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 12.819999694824219, &quot;start&quot;: 12.5, &quot;word&quot;: &quot;systems&quot;}, {&quot;end&quot;: 13.15999984741211, &quot;start&quot;: 12.819999694824219, &quot;word&quot;: &quot;to&quot;}, {&quot;end&quot;: 13.399999618530273, &quot;start&quot;: 13.15999984741211, &quot;word&quot;: &quot;improve&quot;}, {&quot;end&quot;: 14.020000457763672, &quot;start&quot;: 13.399999618530273, &quot;word&quot;: &quot;individual&quot;}, {&quot;end&quot;: 14.9399995803833, &quot;start&quot;: 14.020000457763672, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 14.9399995803833, &quot;start&quot;: 14.9399995803833, &quot;word&quot;: &quot;population&quot;}, {&quot;end&quot;: 15.260000228881836, &quot;start&quot;: 14.9399995803833, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 15.680000305175781, &quot;start&quot;: 15.380000114440918, &quot;word&quot;: &quot;The&quot;}, {&quot;end&quot;: 16.059999465942383, &quot;start&quot;: 15.680000305175781, &quot;word&quot;: &quot;main&quot;}, {&quot;end&quot;: 16.280000686645508, &quot;start&quot;: 16.059999465942383, &quot;word&quot;: &quot;goals&quot;}, {&quot;end&quot;: 17.0, &quot;start&quot;: 16.280000686645508, &quot;word&quot;: &quot;of&quot;}, {&quot;end&quot;: 17.0, &quot;start&quot;: 17.0, &quot;word&quot;: &quot;medicine&quot;}, {&quot;end&quot;: 17.31999969482422, &quot;start&quot;: 17.0, &quot;word&quot;: &quot;are&quot;}, {&quot;end&quot;: 17.81999969482422, &quot;start&quot;: 17.31999969482422, &quot;word&quot;: &quot;prevention&quot;}, {&quot;end&quot;: 18.65999984741211, &quot;start&quot;: 18.420000076293945, &quot;word&quot;: &quot;stop&quot;}, {&quot;end&quot;: 19.059999465942383, &quot;start&quot;: 18.65999984741211, &quot;word&quot;: &quot;disease&quot;}, {&quot;end&quot;: 19.479999542236328, &quot;start&quot;: 19.059999465942383, &quot;word&quot;: &quot;before&quot;}, {&quot;end&quot;: 20.100000381469727, &quot;start&quot;: 19.479999542236328, &quot;word&quot;: &quot;it&quot;}, {&quot;end&quot;: 20.100000381469727, &quot;start&quot;: 20.100000381469727, &quot;word&quot;: &quot;occurs&quot;}, {&quot;end&quot;: 21.1200008392334, &quot;start&quot;: 20.760000228881836, &quot;word&quot;: &quot;vaccination&quot;}, {&quot;end&quot;: 21.959999084472656, &quot;start&quot;: 21.959999084472656, &quot;word&quot;: &quot;screening&quot;}, {&quot;end&quot;: 22.84000015258789, &quot;start&quot;: 22.84000015258789, &quot;word&quot;: &quot;lifestyle&quot;}, {&quot;end&quot;: 24.15999984741211, &quot;start&quot;: 23.3799991607666, &quot;word&quot;: &quot;Diagnosis&quot;}, {&quot;end&quot;: 25.18000030517578, &quot;start&quot;: 25.18000030517578, &quot;word&quot;: &quot;identify&quot;}, {&quot;end&quot;: 25.540000915527344, &quot;start&quot;: 25.18000030517578, &quot;word&quot;: &quot;the&quot;}, {&quot;end&quot;: 25.860000610351562, &quot;start&quot;: 25.540000915527344, &quot;word&quot;: &quot;cause&quot;}, {&quot;end&quot;: 26.459999084472656, &quot;start&quot;: 25.860000610351562, &quot;word&quot;: &quot;of&quot;}, {&quot;end&quot;: 26.459999084472656, &quot;start&quot;: 26.459999084472656, &quot;word&quot;: &quot;symptoms&quot;}, {&quot;end&quot;: 26.799999237060547, &quot;start&quot;: 26.459999084472656, &quot;word&quot;: &quot;using&quot;}, {&quot;end&quot;: 27.34000015258789, &quot;start&quot;: 26.799999237060547, &quot;word&quot;: &quot;history&quot;}, {&quot;end&quot;: 28.200000762939453, &quot;start&quot;: 27.780000686645508, &quot;word&quot;: &quot;exam&quot;}, {&quot;end&quot;: 28.940000534057617, &quot;start&quot;: 28.600000381469727, &quot;word&quot;: &quot;labs&quot;}, {&quot;end&quot;: 29.739999771118164, &quot;start&quot;: 29.739999771118164, &quot;word&quot;: &quot;imaging&quot;}, {&quot;end&quot;: 31.239999771118164, &quot;start&quot;: 30.0, &quot;word&quot;: &quot;Treatment&quot;}, {&quot;end&quot;: 31.600000381469727, &quot;start&quot;: 31.360000610351562, &quot;word&quot;: &quot;cure&quot;}, {&quot;end&quot;: 32.119998931884766, &quot;start&quot;: 31.600000381469727, &quot;word&quot;: &quot;or&quot;}, {&quot;end&quot;: 32.41999816894531, &quot;start&quot;: 32.119998931884766, &quot;word&quot;: &quot;control&quot;}, {&quot;end&quot;: 32.91999816894531, &quot;start&quot;: 32.41999816894531, &quot;word&quot;: &quot;disease&quot;}, {&quot;end&quot;: 33.380001068115234, &quot;start&quot;: 32.91999816894531, &quot;word&quot;: &quot;using&quot;}, {&quot;end&quot;: 33.84000015258789, &quot;start&quot;: 33.380001068115234, &quot;word&quot;: &quot;drugs&quot;}, {&quot;end&quot;: 34.720001220703125, &quot;start&quot;: 34.720001220703125, &quot;word&quot;: &quot;surgery&quot;}, {&quot;end&quot;: 35.47999954223633, &quot;start&quot;: 35.47999954223633, &quot;word&quot;: &quot;therapy&quot;}, {&quot;end&quot;: 36.540000915527344, &quot;start&quot;: 35.720001220703125, &quot;word&quot;: &quot;or&quot;}, {&quot;end&quot;: 36.540000915527344, &quot;start&quot;: 36.540000915527344, &quot;word&quot;: &quot;behavioral&quot;}, {&quot;end&quot;: 37.220001220703125, &quot;start&quot;: 36.540000915527344, &quot;word&quot;: &quot;interventions&quot;}, {&quot;end&quot;: 38.52000045776367, &quot;start&quot;: 37.959999084472656, &quot;word&quot;: &quot;Rehabilitation&quot;}, {&quot;end&quot;: 39.02000045776367, &quot;start&quot;: 38.52000045776367, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 39.459999084472656, &quot;start&quot;: 39.02000045776367, &quot;word&quot;: &quot;palliative&quot;}, {&quot;end&quot;: 39.79999923706055, &quot;start&quot;: 39.459999084472656, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 40.560001373291016, &quot;start&quot;: 40.52000045776367, &quot;word&quot;: &quot;restore&quot;}, {&quot;end&quot;: 41.099998474121094, &quot;start&quot;: 40.560001373291016, &quot;word&quot;: &quot;function&quot;}, {&quot;end&quot;: 41.439998626708984, &quot;start&quot;: 41.099998474121094, &quot;word&quot;: &quot;or&quot;}, {&quot;end&quot;: 41.779998779296875, &quot;start&quot;: 41.439998626708984, &quot;word&quot;: &quot;relieve&quot;}, {&quot;end&quot;: 42.18000030517578, &quot;start&quot;: 41.779998779296875, &quot;word&quot;: &quot;suffering&quot;}, {&quot;end&quot;: 42.619998931884766, &quot;start&quot;: 42.18000030517578, &quot;word&quot;: &quot;when&quot;}, {&quot;end&quot;: 42.86000061035156, &quot;start&quot;: 42.619998931884766, &quot;word&quot;: &quot;cure&quot;}, {&quot;end&quot;: 43.18000030517578, &quot;start&quot;: 42.86000061035156, &quot;word&quot;: &quot;isn't&quot;}, {&quot;end&quot;: 43.63999938964844, &quot;start&quot;: 43.18000030517578, &quot;word&quot;: &quot;possible&quot;}, {&quot;end&quot;: 44.720001220703125, &quot;start&quot;: 44.619998931884766, &quot;word&quot;: &quot;The&quot;}, {&quot;end&quot;: 44.959999084472656, &quot;start&quot;: 44.720001220703125, &quot;word&quot;: &quot;core&quot;}, {&quot;end&quot;: 45.31999969482422, &quot;start&quot;: 44.959999084472656, &quot;word&quot;: &quot;components&quot;}, {&quot;end&quot;: 46.08000183105469, &quot;start&quot;: 45.31999969482422, &quot;word&quot;: &quot;of&quot;}, {&quot;end&quot;: 46.08000183105469, &quot;start&quot;: 46.08000183105469, &quot;word&quot;: &quot;medicine&quot;}, {&quot;end&quot;: 46.63999938964844, &quot;start&quot;: 46.08000183105469, &quot;word&quot;: &quot;include&quot;}, {&quot;end&quot;: 47.18000030517578, &quot;start&quot;: 46.63999938964844, &quot;word&quot;: &quot;clinical&quot;}, {&quot;end&quot;: 47.58000183105469, &quot;start&quot;: 47.18000030517578, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 48.2599983215332, &quot;start&quot;: 48.15999984741211, &quot;word&quot;: &quot;direct&quot;}, {&quot;end&quot;: 48.720001220703125, &quot;start&quot;: 48.2599983215332, &quot;word&quot;: &quot;patient&quot;}, {&quot;end&quot;: 49.02000045776367, &quot;start&quot;: 48.720001220703125, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 49.380001068115234, &quot;start&quot;: 49.02000045776367, &quot;word&quot;: &quot;provided&quot;}, {&quot;end&quot;: 49.79999923706055, &quot;start&quot;: 49.380001068115234, &quot;word&quot;: &quot;by&quot;}, {&quot;end&quot;: 50.2599983215332, &quot;start&quot;: 49.79999923706055, &quot;word&quot;: &quot;physicians&quot;}, {&quot;end&quot;: 51.060001373291016, &quot;start&quot;: 51.060001373291016, &quot;word&quot;: &quot;nurses&quot;}, {&quot;end&quot;: 52.08000183105469, &quot;start&quot;: 51.7400016784668, &quot;word&quot;: &quot;pharmacists&quot;}, {&quot;end&quot;: 52.91999816894531, &quot;start&quot;: 52.540000915527344, &quot;word&quot;: &quot;therapists&quot;}, {&quot;end&quot;: 54.060001373291016, &quot;start&quot;: 53.81999969482422, &quot;word&quot;: &quot;Primary&quot;}, {&quot;end&quot;: 54.41999816894531, &quot;start&quot;: 54.060001373291016, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 55.20000076293945, &quot;start&quot;: 55.02000045776367, &quot;word&quot;: &quot;first&quot;}, {&quot;end&quot;: 55.68000030517578, &quot;start&quot;: 55.20000076293945, &quot;word&quot;: &quot;contact&quot;}, {&quot;end&quot;: 56.58000183105469, &quot;start&quot;: 56.58000183105469, &quot;word&quot;: &quot;continuity&quot;}, {&quot;end&quot;: 57.400001525878906, &quot;start&quot;: 57.13999938964844, &quot;word&quot;: &quot;coordination&quot;}, {&quot;end&quot;: 58.060001373291016, &quot;start&quot;: 57.400001525878906, &quot;word&quot;: &quot;of&quot;}, {&quot;end&quot;: 58.060001373291016, &quot;start&quot;: 58.060001373291016, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 59.02000045776367, &quot;start&quot;: 58.63999938964844, &quot;word&quot;: &quot;specialty&quot;}, {&quot;end&quot;: 59.380001068115234, &quot;start&quot;: 59.02000045776367, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 60.2400016784668, &quot;start&quot;: 59.380001068115234, &quot;word&quot;: &quot;focused&quot;}, {&quot;end&quot;: 60.63999938964844, &quot;start&quot;: 60.2400016784668, &quot;word&quot;: &quot;fields&quot;}, {&quot;end&quot;: 61.540000915527344, &quot;start&quot;: 61.0, &quot;word&quot;: &quot;cardiology&quot;}, {&quot;end&quot;: 62.400001525878906, &quot;start&quot;: 62.279998779296875, &quot;word&quot;: &quot;oncology&quot;}, {&quot;end&quot;: 63.459999084472656, &quot;start&quot;: 63.2400016784668, &quot;word&quot;: &quot;psychiatry&quot;}, {&quot;end&quot;: 64.12000274658203, &quot;start&quot;: 63.7599983215332, &quot;word&quot;: &quot;et&quot;}, {&quot;end&quot;: 64.12000274658203, &quot;start&quot;: 64.12000274658203, &quot;word&quot;: &quot;cetera&quot;}, {&quot;end&quot;: 64.94000244140625, &quot;start&quot;: 64.94000244140625, &quot;word&quot;: &quot;Public&quot;}, {&quot;end&quot;: 65.22000122070312, &quot;start&quot;: 64.94000244140625, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 66.16000366210938, &quot;start&quot;: 65.80000305175781, &quot;word&quot;: &quot;population&quot;}, {&quot;end&quot;: 66.55999755859375, &quot;start&quot;: 66.16000366210938, &quot;word&quot;: &quot;level&quot;}, {&quot;end&quot;: 67.0199966430664, &quot;start&quot;: 66.55999755859375, &quot;word&quot;: &quot;prevention&quot;}, {&quot;end&quot;: 67.91999816894531, &quot;start&quot;: 67.91999816894531, &quot;word&quot;: &quot;surveillance&quot;}, {&quot;end&quot;: 68.36000061035156, &quot;start&quot;: 67.91999816894531, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 68.81999969482422, &quot;start&quot;: 68.36000061035156, &quot;word&quot;: &quot;policy&quot;}, {&quot;end&quot;: 69.81999969482422, &quot;start&quot;: 69.80000305175781, &quot;word&quot;: &quot;research&quot;}, {&quot;end&quot;: 70.68000030517578, &quot;start&quot;: 70.63999938964844, &quot;word&quot;: &quot;basic&quot;}, {&quot;end&quot;: 71.12000274658203, &quot;start&quot;: 70.68000030517578, &quot;word&quot;: &quot;science&quot;}, {&quot;end&quot;: 71.77999877929688, &quot;start&quot;: 71.77999877929688, &quot;word&quot;: &quot;clinical&quot;}, {&quot;end&quot;: 72.23999786376953, &quot;start&quot;: 71.77999877929688, &quot;word&quot;: &quot;trials&quot;}, {&quot;end&quot;: 73.37999725341797, &quot;start&quot;: 72.87999725341797, &quot;word&quot;: &quot;epidemiology&quot;}, {&quot;end&quot;: 73.69999694824219, &quot;start&quot;: 73.37999725341797, &quot;word&quot;: &quot;to&quot;}, {&quot;end&quot;: 74.04000091552734, &quot;start&quot;: 73.69999694824219, &quot;word&quot;: &quot;create&quot;}, {&quot;end&quot;: 74.5199966430664, &quot;start&quot;: 74.04000091552734, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 74.63999938964844, &quot;start&quot;: 74.5199966430664, &quot;word&quot;: &quot;test&quot;}, {&quot;end&quot;: 75.0199966430664, &quot;start&quot;: 74.63999938964844, &quot;word&quot;: &quot;new&quot;}, {&quot;end&quot;: 75.45999908447266, &quot;start&quot;: 75.0199966430664, &quot;word&quot;: &quot;interventions&quot;}, {&quot;end&quot;: 76.4000015258789, &quot;start&quot;: 76.30000305175781, &quot;word&quot;: &quot;Health&quot;}, {&quot;end&quot;: 76.73999786376953, &quot;start&quot;: 76.4000015258789, &quot;word&quot;: &quot;systems&quot;}, {&quot;end&quot;: 77.0999984741211, &quot;start&quot;: 76.73999786376953, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 77.41999816894531, &quot;start&quot;: 77.0999984741211, &quot;word&quot;: &quot;policy&quot;}, {&quot;end&quot;: 78.0, &quot;start&quot;: 77.83999633789062, &quot;word&quot;: &quot;how&quot;}, {&quot;end&quot;: 78.26000213623047, &quot;start&quot;: 78.0, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 78.9800033569336, &quot;start&quot;: 78.26000213623047, &quot;word&quot;: &quot;is&quot;}, {&quot;end&quot;: 78.9800033569336, &quot;start&quot;: 78.9800033569336, &quot;word&quot;: &quot;organized&quot;}, {&quot;end&quot;: 79.77999877929688, &quot;start&quot;: 79.77999877929688, &quot;word&quot;: &quot;financed&quot;}, {&quot;end&quot;: 80.37999725341797, &quot;start&quot;: 79.95999908447266, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 80.76000213623047, &quot;start&quot;: 80.37999725341797, &quot;word&quot;: &quot;regulated&quot;}]">
            <Frame start="0" end="15.408">
                <Image>
                    <h3>Medicine</h3>
                    <p>
                        <MyTooltip>
                        The field of medicine is a vast and intricate domain dedicated to understanding, diagnosing, treating, and preventing disease and illness in order to improve and maintain human health
                        </MyTooltip>
                        as a discipline
                    </p>
                </Image>
                </Frame>
            <Frame start="15.408" end="44.472">
                <Image>
                    <h3>Main goals</h3>
                    <ol>
                        <li>
                            Prevention
                            <MyTooltip>
                            Stop disease before it occurs (vaccination, screening, lifestyle).
                            </MyTooltip>
                        </li>
                        <li>
                            Diagnosis
                            <MyTooltip>
                            Identify the cause of symptoms using history, exam, labs, imaging.
                            </MyTooltip>
                        </li>
                        <li>
                            Treatment
                            <MyTooltip>
                            Cure or control disease using drugs, surgery, therapy, or behavioral interventions.
                            </MyTooltip>
                        </li>
                        <li>
                            Rehabilitation &amp; palliative care
                            <MyTooltip>
                            Restore function or relieve suffering when cure isn’t possible.
                            </MyTooltip>
                        </li>
                    </ol>
                </Image>
                </Frame>
            <Frame start="44.472" end="81.432">
                <Image>
                <h3>Core components</h3>
                <ul>
                    <li>
                        Clinical care
                        <MyTooltip>
                        Direct patient care provided by physicians, nurses, pharmacists, therapists.
                        </MyTooltip>
                    </li>
                    <li>
                        Primary care
                        <MyTooltip>
                        First contact, continuity, coordination of care.
                        </MyTooltip>
                    </li>
                    <li>
                        Specialty care
                        <MyTooltip>
                        Focused fields (cardiology, oncology, psychiatry, etc.).
                        </MyTooltip>
                    </li>
                    <li>
                        Public health
                        <MyTooltip>
                        Population-level prevention, surveillance, and policy.
                        </MyTooltip>
                    </li>
                    <li>
                        Research
                        <MyTooltip>
                        Basic science, clinical trials, epidemiology to create and test new interventions.
                        </MyTooltip>
                    </li>
                    <li>
                        Health systems &amp; policy
                        <MyTooltip>
                        How care is organized, financed, and regulated.
                        </MyTooltip>
                    </li>
                </ul>
                </Image>
                </Frame>
        </Video><BigUl title="How it works in practice">
            <BigLi title="Patient assessment">
                <p>History + physical exam.</p>
            </BigLi>
            <BigLi title="Diagnostic tests">
                <p>Blood tests, imaging (X‑ray, CT, MRI), biopsies, genetic tests.</p>
            </BigLi>
            <BigLi title="Decision-making">
                <p>Differential diagnosis, evidence-based guidelines, risk–benefit analysis.</p>
            </BigLi>
            <BigLi title="Treatment plan">
                <p>Medications, procedures, lifestyle changes, follow-up and monitoring.</p>
            </BigLi>
            <BigLi title="Multidisciplinary teams">
                <p>Coordinate complex care.</p>
            </BigLi>
        </BigUl>
        <h3>Types of therapies</h3>
        <ul>
            <li>Pharmacological (antibiotics, antihypertensives, insulin).</li>
            <li>Surgical and procedural (appendectomy, angioplasty).</li>
            <li>Behavioral/psychosocial (therapy, counseling, smoking cessation programs).</li>
            <li>Device-based (pacemakers, prosthetics).</li>
            <li>Preventive (vaccines, screening programs).</li>
        </ul>
        <BigUl title="Evidence-based medicine">
            <BigLi title="Overview">
                <p>Uses high-quality research (randomized trials, systematic reviews) combined with clinical expertise and patient values to make decisions.</p>
                <br/>
                <p>Clinical guidelines summarize best evidence but require individualization.</p>
            </BigLi>
            <BigLi title="Drug and treatment development (brief)">
                <p>Discovery/basic research → preclinical (lab/animal) → clinical trials (Phase I–III) → regulatory approval → Phase IV (post-marketing) surveillance.</p>
            </BigLi>
        </BigUl>
        <BigUl title="Ethics, safety, and limitations">
            <BigLi title="Core ethical principles">
                <ul>
                    <li>Beneficence</li>
                    <li>Nonmaleficence</li>
                    <li>Autonomy</li>
                    <li>Justice</li>
                </ul>
            </BigLi>
            <BigLi title="Patient safety">
                <p>Patient safety, informed consent, equity of access are central concerns.</p>
            </BigLi>
            <BigLi title="Limitations">
                <p>Medicine can’t cure everything; diagnostic uncertainty, side effects, and social determinants of health limit outcomes.</p>
            </BigLi>
        </BigUl>
        <Audio title="Public health and social determinants" src="https://cherry-blossom.s3.mx-central-1.amazonaws.com/f4ceaced-5e6b-45a7-b7ec-b6da48f8d0a4.mp3" transcript="[{&quot;end&quot;: 0.3400000035762787, &quot;start&quot;: 0.0, &quot;word&quot;: &quot;Health&quot;}, {&quot;end&quot;: 0.8199999928474426, &quot;start&quot;: 0.3400000035762787, &quot;word&quot;: &quot;is&quot;}, {&quot;end&quot;: 0.8199999928474426, &quot;start&quot;: 0.8199999928474426, &quot;word&quot;: &quot;shaped&quot;}, {&quot;end&quot;: 1.5800000429153442, &quot;start&quot;: 0.8199999928474426, &quot;word&quot;: &quot;by&quot;}, {&quot;end&quot;: 1.5800000429153442, &quot;start&quot;: 1.5800000429153442, &quot;word&quot;: &quot;income&quot;}, {&quot;end&quot;: 2.4200000762939453, &quot;start&quot;: 2.4200000762939453, &quot;word&quot;: &quot;education&quot;}, {&quot;end&quot;: 3.359999895095825, &quot;start&quot;: 3.359999895095825, &quot;word&quot;: &quot;environment&quot;}, {&quot;end&quot;: 3.9600000381469727, &quot;start&quot;: 3.619999885559082, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 4.059999942779541, &quot;start&quot;: 3.9600000381469727, &quot;word&quot;: &quot;access&quot;}, {&quot;end&quot;: 4.5, &quot;start&quot;: 4.059999942779541, &quot;word&quot;: &quot;to&quot;}, {&quot;end&quot;: 4.579999923706055, &quot;start&quot;: 4.5, &quot;word&quot;: &quot;care&quot;}, {&quot;end&quot;: 5.639999866485596, &quot;start&quot;: 5.579999923706055, &quot;word&quot;: &quot;Public&quot;}, {&quot;end&quot;: 5.900000095367432, &quot;start&quot;: 5.639999866485596, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 6.380000114440918, &quot;start&quot;: 5.900000095367432, &quot;word&quot;: &quot;interventions&quot;}, {&quot;end&quot;: 6.739999771118164, &quot;start&quot;: 6.380000114440918, &quot;word&quot;: &quot;can&quot;}, {&quot;end&quot;: 6.980000019073486, &quot;start&quot;: 6.739999771118164, &quot;word&quot;: &quot;have&quot;}, {&quot;end&quot;: 7.340000152587891, &quot;start&quot;: 6.980000019073486, &quot;word&quot;: &quot;larger&quot;}, {&quot;end&quot;: 7.960000038146973, &quot;start&quot;: 7.340000152587891, &quot;word&quot;: &quot;population&quot;}, {&quot;end&quot;: 8.5, &quot;start&quot;: 7.960000038146973, &quot;word&quot;: &quot;impact&quot;}, {&quot;end&quot;: 9.020000457763672, &quot;start&quot;: 8.5, &quot;word&quot;: &quot;than&quot;}, {&quot;end&quot;: 9.640000343322754, &quot;start&quot;: 9.020000457763672, &quot;word&quot;: &quot;individual&quot;}, {&quot;end&quot;: 10.079999923706055, &quot;start&quot;: 9.640000343322754, &quot;word&quot;: &quot;treatment&quot;}, {&quot;end&quot;: 10.5, &quot;start&quot;: 10.079999923706055, &quot;word&quot;: &quot;alone&quot;}]"/><Video title="Trends and future directions" audioSrc="https://cherry-blossom.s3.mx-central-1.amazonaws.com/7f2a9de3-dad4-4a3c-aed3-4b34958f4a82.mp3" transcript="[{&quot;end&quot;: 0.47999998927116394, &quot;start&quot;: 0.0, &quot;word&quot;: &quot;Precision&quot;}, {&quot;end&quot;: 1.1799999475479126, &quot;start&quot;: 0.47999998927116394, &quot;word&quot;: &quot;personalized&quot;}, {&quot;end&quot;: 1.6799999475479126, &quot;start&quot;: 1.1799999475479126, &quot;word&quot;: &quot;medicine&quot;}, {&quot;end&quot;: 2.5199999809265137, &quot;start&quot;: 2.0799999237060547, &quot;word&quot;: &quot;genomics&quot;}, {&quot;end&quot;: 3.259999990463257, &quot;start&quot;: 3.259999990463257, &quot;word&quot;: &quot;digital&quot;}, {&quot;end&quot;: 3.680000066757202, &quot;start&quot;: 3.259999990463257, &quot;word&quot;: &quot;health&quot;}, {&quot;end&quot;: 4.800000190734863, &quot;start&quot;: 4.139999866485596, &quot;word&quot;: &quot;telemedicine&quot;}, {&quot;end&quot;: 5.300000190734863, &quot;start&quot;: 5.099999904632568, &quot;word&quot;: &quot;wearable&quot;}, {&quot;end&quot;: 5.760000228881836, &quot;start&quot;: 5.300000190734863, &quot;word&quot;: &quot;monitoring&quot;}, {&quot;end&quot;: 6.659999847412109, &quot;start&quot;: 6.639999866485596, &quot;word&quot;: &quot;AI&quot;}, {&quot;end&quot;: 7.059999942779541, &quot;start&quot;: 6.659999847412109, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 7.699999809265137, &quot;start&quot;: 7.059999942779541, &quot;word&quot;: &quot;diagnostics&quot;}, {&quot;end&quot;: 8.859999656677246, &quot;start&quot;: 8.460000038146973, &quot;word&quot;: &quot;biologics&quot;}, {&quot;end&quot;: 9.180000305175781, &quot;start&quot;: 8.859999656677246, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 9.460000038146973, &quot;start&quot;: 9.180000305175781, &quot;word&quot;: &quot;cell&quot;}, {&quot;end&quot;: 9.859999656677246, &quot;start&quot;: 9.460000038146973, &quot;word&quot;: &quot;therapies&quot;}, {&quot;end&quot;: 10.859999656677246, &quot;start&quot;: 10.739999771118164, &quot;word&quot;: &quot;stronger&quot;}, {&quot;end&quot;: 11.199999809265137, &quot;start&quot;: 10.859999656677246, &quot;word&quot;: &quot;emphasis&quot;}, {&quot;end&quot;: 11.680000305175781, &quot;start&quot;: 11.199999809265137, &quot;word&quot;: &quot;on&quot;}, {&quot;end&quot;: 11.979999542236328, &quot;start&quot;: 11.680000305175781, &quot;word&quot;: &quot;prevention&quot;}, {&quot;end&quot;: 12.4399995803833, &quot;start&quot;: 11.979999542236328, &quot;word&quot;: &quot;and&quot;}, {&quot;end&quot;: 12.699999809265137, &quot;start&quot;: 12.4399995803833, &quot;word&quot;: &quot;value&quot;}, {&quot;end&quot;: 12.960000038146973, &quot;start&quot;: 12.699999809265137, &quot;word&quot;: &quot;based&quot;}, {&quot;end&quot;: 13.220000267028809, &quot;start&quot;: 12.960000038146973, &quot;word&quot;: &quot;care&quot;}]">
            <Frame start="0" end="13.752">
                <Image>
                    <h3>Trends and future directions</h3>
                    <ul>
                        <li>Precision/personalized medicine (genomics)</li>
                        <li>Digital health (telemedicine, wearable monitoring)</li>
                        <li>AI in diagnostics</li>
                        <li>Biologics and cell therapies</li>
                        <li>Stronger emphasis on prevention and value-based care</li>
                    </ul>
                </Image>
                </Frame>
        </Video><p>If you want, I can:</p>
        <ul>
            <li>Explain a specific specialty (e.g., cardiology).</li>
            <li>Describe how a particular drug or vaccine works.</li>
            <li>Walk through the process of diagnosis for a symptom (e.g., chest pain).</li>
            <li>Explain medical training and how professionals are licensed.</li>
        </ul>
        
</>
    );
}