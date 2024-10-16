import React from 'react';
import { Wrapper } from '../style';

const TotalTable = () => {
  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Total FK</th>
            <th>Total Point</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1</td>
            <td>MIRAEN SEJONG</td>
            <td>65</td>
            <td>94</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Ahser</td>
            <td>50</td>
            <td>76</td>
          </tr>
          <tr>
            <td>#3</td>
            <td>Seongnam ROX</td>
            <td>45</td>
            <td>74</td>
          </tr>
          <tr>
            <td>#4</td>
            <td>Autoarms</td>
            <td>49</td>
            <td>64</td>
          </tr>
          <tr>
            <td>#5</td>
            <td>Cartel</td>
            <td>40</td>
            <td>63</td>
          </tr>
          <tr>
            <td>#6</td>
            <td>Sparkle Esports</td>
            <td>43</td>
            <td>58</td>
          </tr>
          <tr>
            <td>#7</td>
            <td>DH.CNJ</td>
            <td>33</td>
            <td>49</td>
          </tr>
          <tr>
            <td>#8</td>
            <td>BNK FearX</td>
            <td>37</td>
            <td>46</td>
          </tr>
        </tbody>
      </table>
    </Wrapper>
  );
};

export default TotalTable;
